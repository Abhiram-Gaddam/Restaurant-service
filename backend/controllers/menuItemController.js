const MenuItem = require("../models/MenuItem");

exports.createMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.create(req.body);
    res.status(201).json(menuItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find({ isActive: true })
      .populate("category");
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    await MenuItem.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: "Menu item removed " });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
