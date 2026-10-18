import mongoose from "mongoose";
import {
  ORDER_STATUS_CANCELED,
  ORDER_STATUS_CONFIRMED,
  ORDER_STATUS_DELIVERED,
  ORDER_STATUS_PENDING,
  ORDER_STATUS_SHIPPED,
} from "../constants/orderStatus.js";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "User is required."],
  },
  orderItems: [
    {
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: [true, "Product is required."],
      },
      quantity: {
        type: Number,
        default: 1,
        min: [1, "Quantity must be atleast one."],
      },
    },
  ],
  orderStatus: {     
    type: String,
    default: ORDER_STATUS_PENDING,
    enum: [
      ORDER_STATUS_PENDING,
      ORDER_STATUS_CONFIRMED,
      ORDER_STATUS_SHIPPED,
      ORDER_STATUS_DELIVERED,
      ORDER_STATUS_CANCELED,
    ],
  },
  shippingAddress: {
    city: {
      type: String,
      required: true,
    },
    province: String,
    street: String,
    country: {
      type: String,
      default: "Nepal",
    },
  },
  orderNumber: {
    type: String,
    required: [true, "order number is required."],
  },
  totalPrice: {
    type: Number,
    required: [true, "Total price is requird."],
  },
  payment: {
    type: mongoose.Schema.ObjectId,
    ref: "Payment",
  },
  createdDate: {
    type: Date,
    default: Date.now(),
    immutable: true,
  },
});

export default mongoose.model("Order", orderSchema);
