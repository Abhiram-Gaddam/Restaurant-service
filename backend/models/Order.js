const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      required: true
    },

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true // ensures only booked users order
    },

    items: [
      {
        menuItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MenuItem",
          required: true
        },
        quantity: { type: Number, required: true },
        priceAtOrder: { type: Number, required: true } // store price snapshot
      }
    ],

    totalAmount: { type: Number, required: true },

    orderStatus: {
      type: String,
      enum: ["placed", "preparing", "served", "cancelled"],
      default: "placed"
    },

    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
