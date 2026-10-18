import mongoose from "mongoose";

const resetPasswordSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "UserId is required."],
    },
    token: {
        type: String, 
        required: [true, "Reset password token is requried."]
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        immutable: true,
    },
    expiresAt: {
        type: Date,
        default: Date.now() + 3600000,
        immutable: true,
    },
    isUsed: {
        type: Boolean,
        default: false,
    }
});

export default mongoose.model("ResetPassword", resetPasswordSchema)