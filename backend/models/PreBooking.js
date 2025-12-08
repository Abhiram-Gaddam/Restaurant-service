const mongoose = require("mongoose");

const preBookingSchema = new mongoose.Schema(
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

    date: {
      type: String,
      required: true
    },

    time: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["requested", "approved", "rejected"],
      default: "requested"
    },
    isActive : {
        type: Boolean,
        default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("PreBooking", preBookingSchema);
