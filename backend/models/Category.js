const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true } // soft delete
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
