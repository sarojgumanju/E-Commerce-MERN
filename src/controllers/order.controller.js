import { success } from "zod";
import orderService from "../services/order.service.js";

const getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    return res.status(200).json({
      success: true,
      message: "All orders retrieved.",
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Orders retrieval failed.",
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      message: "Order retrieve successfull.",
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve order.",
    });
  }
};

const createOrder = async (req, res) => {
  try {
    const order = await orderService.createOrder(req.body, req.user);
    return res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      data: order,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to place order.",
    });
  }
};

const updateOrderStatus = async (req, res) => {
    if(!req.body?.status){
        return res.status(400).json({
            success: false,  
            message: "Status is required."
        })
    }
    try {
        const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
        return res.status(200).json({
            success: true, 
            message: "Order status updated successfully.",
            data: order,
        });
    } catch (error) {
        return res.status(500).json({
            success: false, 
            message: "Failed order status update" || error.message,
        });
    }
};

const cancelOrder = async (req, res) => {
    try {
        const order = await orderService.cancelOrder(req.params.id);
        return res.status(200).json({
            success: true, 
            message: "Order cancelled",
            data: order
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to cancel order."
        });
    }
};

const deleteOrder = async (req, res) => {
    try {
        await orderService.deleteOrder(req.params.id);
        return res.status(200).json({
            success: true, 
            message: "Order deleted",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to delete order."
        });
    }
};

const confirmOrder = async (req, res) => {
  try {
    const order = await orderService.confirmOrder(req.params.id, req.body.status);
    return res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
      
    });
  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      message: error.message || "Failed to confirm order.",
    });
  }
};

const getOrdersByUser = async (req, res) => {
    try {
        const orders = await orderService.getOrdersByUser(req.user._id);
        return res.status(200).json({
            success: true, 
            message: "User's order retrieved",
            data: orders
        });
    } catch (error) {
        return res.status(400).json({
            success: false, 
            message: "Failed to confirm order."
        });
    }
};

const getOrdersByMerchant = async (req, res) => {
  try {
    const orders = await orderService.getOrdersByMerchant(req.user._id);
    return res.status(200).json({
      success: true, 
      message: "Merchant's orders retrieved succesfully.",
      count: orders.length,
      orders: orders
    });
  } catch (error) {
    return res.status(500).json({
      success: false, 
      message: error.message || "Could not retrieve merchant's orders."
    }); 
  }
};

const orderPaymentViaCash = async (req, res) => {
  try {
    const order = await orderService.orderPaymentViaCash(req.params.id);

    return res.status(200).json({
      success: true, 
      message: "Payment done via cash",
      order
    });
  } catch (error) {
    return res.status(400).json({
      success: false, 
      message: error.message
    })
  }
};

const orderPaymentViaKhalti = async (req, res) => {
  try {
    const order = await orderService.orderPaymentViaKhalti(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Payment successfull via khalti",
      order
    });
  } catch (error) {
    return res.status(400).json({
      success: false, 
      message: error.message || "khalti payment unsuccessfull.",
    })
  }
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
