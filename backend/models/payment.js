const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Order",
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["card", "mobile"],
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: "PKR",
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["completed", "failed", "pending"],
      default: "completed",
    },

    cardDetails: {
      cardNumber: String,
      expiryMonth: String,
      expiryYear: String,
      cvv: String,
    },
    mobileDetails: {
      phoneNumber: String,
      cnic: String,
    },
    paymentDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
