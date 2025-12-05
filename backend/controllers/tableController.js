const Table = require("../models/Table");

// CREATE TABLE (ADMIN)
exports.createTable = async (req, res) => {
  try {
    const table = await Table.create(req.body);
    res.status(201).json(table);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL TABLES (USER + ADMIN)
exports.getTables = async (req, res) => {
  try {
    const tables = await Table.find();
    res.json(tables);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE TABLE (ADMIN)
exports.updateTable = async (req, res) => {
  try {
    const updated = await Table.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE TABLE (ADMIN)
exports.deleteTable = async (req, res) => {
  try {
    await Table.findByIdAndDelete(req.params.id);
    res.json({ message: "Table deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
