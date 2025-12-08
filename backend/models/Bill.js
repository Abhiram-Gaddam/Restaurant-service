const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true
    },

    totalAmount: { type: Number, required: true },
    taxAmount: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending"
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "upi", "card", "none"],
      default: "none"
    },

    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bill", billSchema);
