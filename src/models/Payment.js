import mongoose from "mongoose";
import { PAYMENT_METHOD_CARD, PAYMENT_METHOD_CASH, PAYMENT_METHOD_ONLINE, PAYMENT_STATUS_FAILED, PAYMENT_STATUS_PENDING, PAYMENT_STATUS_SUCCESS } from "../constants/payment.js";

const paymentSchema = new mongoose.Schema({
    transactionId: {
        type: String,
    },
    amount: {
        type: Number, 
        required: [true, "Payment amount is required."]
    },
    method: {
        type: String,
        enum: [PAYMENT_METHOD_ONLINE, PAYMENT_METHOD_CARD, PAYMENT_METHOD_CASH],
        required: [true, "Payment method is required."]
    },
    paymentStatus: {
        type: String,
        default: PAYMENT_STATUS_PENDING,
        enum: [PAYMENT_STATUS_PENDING, PAYMENT_STATUS_FAILED, PAYMENT_STATUS_SUCCESS ]
    },
    createdAt: {
        type: Date,
        default: Date.now(), 
        immutable: true 
    }
});

export default mongoose.model("Payment", paymentSchema)