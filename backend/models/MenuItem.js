const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category"
    },
    description: String,
    isAvailable: { type: Boolean, default: true }, // out-of-stock toggle
    isActive: { type: Boolean, default: true }     // soft delete
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
