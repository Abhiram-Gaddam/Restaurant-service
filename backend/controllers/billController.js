const Bill = require("../models/Bill");
const Order = require("../models/Order");
const Table = require("../models/Table");
const Booking = require("../models/Booking");

const TAX_RATE = 0.05; // reuse same rate

// MANUAL or RE-USEABLE BILL GENERATION
exports.generateBillForOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    let existingBill = await Bill.findOne({
      order: orderId,
      isActive: true
    });

    if (existingBill) {
      return res.json(existingBill); // if already generated, just return
    }

    const order = await Order.findById(orderId);
    if (!order || !order.isActive) {
      return res.status(404).json({ message: "Order not found or inactive" });
    }

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

    res.status(201).json(bill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET BILL BY ORDER (for UI)
exports.getBillByOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const bill = await Bill.findOne({
      order: orderId,
      isActive: true
    });

    if (!bill) return res.status(404).json({ message: "Bill not found" });

    res.json(bill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// MARK BILL AS PAID (TRACKING ONLY)
exports.markBillPaid = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentMethod } = req.body;

    const bill = await Bill.findByIdAndUpdate(
      id,
      {
        paymentStatus: "paid",
        paymentMethod: paymentMethod || "cash"
      },
      { new: true }
    ).populate({
      path: "order",
      populate: ["table", "booking"]
    });

    if (!bill) return res.status(404).json({ message: "Bill not found" });

    // free up table, close booking & order logically
    if (bill.order && bill.order.table) {
      await Table.findByIdAndUpdate(bill.order.table._id, {
        status: "available"
      });
    }

    if (bill.order && bill.order.booking) {
      await Booking.findByIdAndUpdate(bill.order.booking._id, {
        isActive: false,
        status: "completed"
      });
    }

    await Order.findByIdAndUpdate(bill.order._id, {
      isActive: false
    });

    res.json(bill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
