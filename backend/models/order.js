import mongoose, { Schema, ObjectId } from "mongoose";

const orderSchema = new Schema({
  orderItems: [
    {
      type: ObjectId,
      ref: "Product",
    },
  ],
  shippingAddress: {
    fullName: {
      type: String,
      required: [true, "Please provide the recipient's full name."],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Please provide the shipping address."],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "Please provide the city for shipping."],
      trim: true,
    },
    postalCode: {
      type: String,
      required: [true, "Please provide the postal code."],
      trim: true,
    },
  },
  paymentMethod: {
    type: String,
    required: [true, "Please specify the payment method."],
  },
  itemsPrice: {
    type: Number,
    required: [true, "Please provide the total price of the items."],
  },
  shippingPrice: {
    type: Number,
    required: [true, "Please provide the shipping price."],
  },
  taxPrice: {
    type: Number,
    required: [true, "Please provide the tax amount."],
  },
  totalPrice: {
    type: Number,
    required: [true, "Please provide the total order price."],
  },
  user: {
    type: ObjectId,
    ref: "User",
    required: [true, "Please specify the user who placed the order."],
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paidAt: {
    type: Date,
  },
  isDelivered: {
    type: Boolean,
    default: false,
  },
  deliveredAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
