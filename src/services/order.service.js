import Order from "../models/Order.js";
import {
  ORDER_STATUS_CANCELED,
  ORDER_STATUS_CONFIRMED,
} from "../constants/orderStatus.js";
import Payment from "../models/Payment.js";
import {
  PAYMENT_METHOD_CASH,
  PAYMENT_METHOD_ONLINE,
  PAYMENT_STATUS_FAILED,
  PAYMENT_STATUS_SUCCESS,
} from "../constants/payment.js";
import payViaKhalti from "../utils/payment.js";
import User from "../models/User.js";
import userService from "./user.service.js";
import mongoose from "mongoose";

// for admin
const getAllOrders = async () => {
  return await Order.find()
    .sort({ createdAt: -1 })
    .populate("orderItems.product", "name")
    .populate("user", "name");
};

const getOrderById = async (id) => {
  const order = await Order.findById(id)
    .populate("user", "name email phone")
    .populate("orderItems.product", "name brand price imageUrls")
    .populate("payment", "paymentStatus");

  if (!order)
    throw {
      status: 404,
      message: "Order not found.",
    };

  return order;
};

const createOrder = async (data, authUser) => {
  console.log(authUser._id);
  const user = await userService.getUserById(authUser._id, authUser);

  if(!data.shippingAddress){
    data.shippingAddress = user.address;
  }

  data.orderNumber = crypto.randomUUID(); // data ko orderNumber ma crypto.randomUUID() 
  // const orderNumber = crypto.randomUUID();

  return await Order.create({ ...data, user: authUser._id});
};

const updateOrderStatus = async (id, status) => {
  return await Order.findByIdAndUpdate(id, { status }, {returnDocument: "after"});
};

const cancelOrder = async (id) => {
  return await Order.findByIdAndUpdate(
    id,
    { status: ORDER_STATUS_CANCELED },
    { new: true },
  );
};

const deleteOrder = async (id) => {
  await Order.findByIdAndDelete(id);
};

// payment
const confirmOrder = async (id, status) => {
  // Fetch the order
  const order = await getOrderById(id);

  // If payment is not successful, mark it failed and throw
  if (status?.toUpperCase() !== PAYMENT_STATUS_SUCCESS) {
    await Payment.findByIdAndUpdate(order.payment, {
      paymentStatus: PAYMENT_STATUS_FAILED,
    });

    throw {
      status: 400,
      message: "Payment failed."
    };
  }

  // Mark payment as success
  await Payment.findByIdAndUpdate(order.payment, {
    paymentStatus: PAYMENT_STATUS_SUCCESS,
  });

  // Update order status to confirmed
  return await Order.findByIdAndUpdate(
    id,
    { orderStatus: ORDER_STATUS_CONFIRMED },
    {returnDocument: "after"},
  ).populate("payment", "paymentStatus");
};

const getOrdersByUser = async (userId) => {
  //console.log(userId);
  // { user: userId } means: "Find all orders where the user field equals userId."
  return await Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate("user", "name email phone")
    .populate("orderItems.product", "name brand price imageUrls");
};

const getOrdersByMerchant = async (merchantId) => {
  console.log(merchantId);
  return await Order.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "orderUser",
      }
    }, 
    {
      $lookup: {
        from: "products",
        localField: "orderItems.product",
        foreignField: "_id",
        as: "orderedProducts",
      }
    }, 
    {
      $unwind: "$orderUser"
    },
    {
      $match: {
        "orderedProducts.createdBy": new mongoose.Types.ObjectId(merchantId)
      }
    },
    {
      $project: {
        orderNumber: 1,
        payment: 1,
        shippingAddress: 1,
        orderStatus: 1,
        orderItems: 1,
        totalPrice: 1,
        "orderUser.name": 1,
        "orderUser.email": 1,
        "orderUser.phone": 1,
        "orderedProducts._id": 1,
        "orderedProducts.name": 1,
        "orderedProducts.brand": 1,
        "orderedProducts.category": 1,
        "orderedProducts.price": 1,
        "orderedProducts.imageUrl": 1,

      }
    }
  ]);
};

const orderPaymentViaCash = async (id) => {
  const order = await getOrderById(id);
  const orderPayment = await Payment.create({
    method: "CASH",
    amount: order.totalPrice,
  });

  return await Order.findByIdAndUpdate(
    id,
    {
      orderStatus: ORDER_STATUS_CONFIRMED,
      payment: orderPayment.id,
    },
    {returnDocument: "after"},
  )
    .populate("payment", "method amount paymentStatus")
    .populate("orderItems.product", "name");
}; 

const orderPaymentViaKhalti = async (id) => {
  const order = await getOrderById(id);
  const orderPayment = await Payment.create({
    method: PAYMENT_METHOD_ONLINE,
    amount: order.totalPrice,
  });

  await Order.findByIdAndUpdate(id, {
    payment: orderPayment.id,
  })
    .populate("payment", "method amount paymentStatus")
    .populate("orderItems.product", "name");

  return await payViaKhalti({
    amount: order.totalPrice,
    purchaseOrderId: order.orderNumber,
    purchaseOrderName: order.orderItems[0].product.name,
    customerInfo: {
      name: order.user.name,
      email: order.user.email,
      phone: order.user.phone,
    },
  });
};

export default {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
  confirmOrder,
  getOrdersByMerchant,
  getOrdersByUser,
  orderPaymentViaCash,
  orderPaymentViaKhalti,
};
