// GET /analytics/dashboard
const Order = require("../models/Order");
const Booking = require("../models/Booking");

exports.getDashboardMetrics = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const servedOrders = await Order.find({ status: "served" });
    const revenue = servedOrders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);

    // NEW: Get 5 most recent orders (populated with table info)
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("table", "tableNumber");

    // NEW: Quick insight - Count total active tables
    const activeTables = await Booking.countDocuments({ status: "seated" });

    res.json({ 
      totalOrders, 
      revenue, 
      totalBookings, 
      recentOrders,
      activeTables 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};