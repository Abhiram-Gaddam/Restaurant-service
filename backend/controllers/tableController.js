const Table = require("../models/Table");
const Booking = require("../models/Booking");

const defaultTables = [
  { tableNumber: "T-01", capacity: 2, location: "Window Side", isActive: true },
  { tableNumber: "T-02", capacity: 2, location: "Window Side", isActive: true },
  { tableNumber: "T-03", capacity: 4, location: "Main Dining", isActive: true },
  { tableNumber: "T-04", capacity: 4, location: "Main Dining", isActive: true },
  { tableNumber: "T-05", capacity: 6, location: "VIP Section", isActive: true },
  { tableNumber: "T-06", capacity: 8, location: "VIP Section", isActive: true },
];

// SEED LOGIC (Call this in server.js after DB connection)
exports.seedDefaultTables = async () => {
  try {
    const count = await Table.countDocuments({ isActive: true });
    if (count === 0) {
      await Table.insertMany(defaultTables);
      console.log("✅ Default tables seeded successfully.");
    }
  } catch (err) {
    console.error("❌ Error seeding tables:", err.message);
  }
};

// RESET TABLES (Triggered by Admin)
exports.resetTables = async (req, res) => {
  try {
    // 1. Delete everything (Clear the floor)
    await Table.deleteMany({}); 

    // 2. Insert the defaults
    await Table.insertMany(defaultTables);

    // 3. Fetch the NEW list specifically to send back to frontend
    const newTables = await Table.find({ isActive: true });
    
    res.json(newTables);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE TABLE (ADMIN)
exports.createTable = async (req, res) => {
  try {
    const table = await Table.create(req.body);
    res.status(201).json(table);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL TABLES
exports.getTables = async (req, res) => {
  try {
    const tables = await Table.find({ isActive: true });
    res.json(tables);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE TABLE
exports.updateTable = async (req, res) => {
  try {
    const updated = await Table.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE TABLE (Soft Delete)
exports.deleteTable = async (req, res) => {
  try {
    await Table.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: "Table deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET TABLE BY ID
exports.getTableById = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) return res.status(404).json({ message: "Table not found" });
    res.json(table);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET AVAILABLE TABLES
exports.getAvailableTables = async (req, res) => {
  try {
    const { date, time } = req.query;
    const bookings = await Booking.find({ date, time, status: { $ne: "cancelled" }, isActive: true });
    const bookedTableIds = bookings.map(b => b.table);
    const availableTables = await Table.find({ _id: { $nin: bookedTableIds }, isActive: true });
    res.json(availableTables);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};