const Order = require("../models/Order");
const Booking = require("../models/Booking");
const MenuItem = require("../models/MenuItem");
const Bill = require("../models/Bill");
const Table = require("../models/Table");

const TAX_RATE = 0.05; // 5% GST for example

// helper to generate bill (used in auto + manual)
const generateBillIfNotExists = async (orderId) => {
  const existingBill = await Bill.findOne({ order: orderId, isActive: true });
  if (existingBill) return existingBill;

  const order = await Order.findById(orderId);
  if (!order || !order.isActive) throw new Error("Order not found or inactive");

  const totalAmount = order.totalAmount;
  const taxAmount = totalAmount * TAX_RATE;
  const grandTotal = totalAmount + taxAmount;

  const bill = await Bill.create({
    order: order._id,
    totalAmount,
    taxAmount,
    grandTotal,
    paymentStatus: "pending",
    paymentMethod: "none"
  });

  return bill;
};

// USER PLACES ORDER
exports.createOrder = async (req, res) => {
  try {
    const { bookingId, items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Items array is required"
      });
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      user: req.user.id,
      isActive: true,
      status: { $ne: "cancelled" }
    }).populate("table");

    if (!booking) {
      return res.status(400).json({
        message: "No active booking found for this user"
      });
    }

    const itemIds = items.map((it) => it.menuItem);

    const menuItems = await MenuItem.find({
      _id: { $in: itemIds },
      isActive: true,
      isAvailable: true
    });
    // console.log( menuItems );
    // console.log( items );
    if (menuItems.length !== items.length) {
      const dbIds = menuItems.map(m => m._id.toString());
      const invalid = items
        .map(i => i.menuItem)
        .filter(id => !dbIds.includes(id));
      let itemsLength = items.length;
      let menuItemLength = menuItems.length;
      return res.status(400).json({
        message: "Some items are unavailable or invalid "+itemsLength+" " +menuItemLength  ,
        invalidItems: invalid
      });
    }

    const priceMap = {};
    menuItems.forEach((mi) => {
      priceMap[mi._id.toString()] = mi.price;
    });

    let totalAmount = 0;

    const finalItems = items.map((it) => {
      if (!Number.isInteger(it.quantity) || it.quantity <= 0) {
        throw new Error("Invalid quantity for one or more items");
      }

      const price = priceMap[it.menuItem.toString()];
      const lineTotal = price * it.quantity;
      totalAmount += lineTotal;

      return {
        menuItem: it.menuItem,
        quantity: it.quantity,
        priceAtOrder: price
      };
    });

    const order = await Order.create({
      user: req.user.id,
      table: booking.table._id,
      booking: booking._id,
      items: finalItems,
      totalAmount
    });

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
 

// USER: VIEW OWN ORDERS
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
      isActive: true
    })
      .populate("table")
      .populate("items.menuItem");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADMIN: VIEW ALL ORDERS (with pagination, optional status)
exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;

    const query = { isActive: true };
    if (status) query.orderStatus = status;

    const orders = await Order.find(query)
      .populate("user", "-password")
      .populate("table")
      .populate("items.menuItem")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);

    res.json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      orders
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADMIN: UPDATE ORDER STATUS (AUTO BILL GENERATION ON 'served')
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    // if served → auto-generate bill
    let bill = null;
    if (status === "served") {
      bill = await generateBillIfNotExists(order._id);
    }

    res.json({ order, bill });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
