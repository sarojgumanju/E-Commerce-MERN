import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, "Product name is required."],
        minLength: 3,
        maxLength: 30,
    },
    brand: {
        type: String,
    },
    category: {
        type: String, 
        required: [true, "Product category is required."],
    }, 
    price: {
        type: Number,
        required: [true, "Product price is required."],
        min: [1, "Price must be greater than 1"],
        max: [300000, "Price must be less than Rs. 3,00,000"],
    },
    stock: {
        type: Number, 
        min: 0, 
        default: 1,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "createdBy user id is requried."]
    },
    imageUrls: {
        type: [String],
    }
});

export default mongoose.model("Product", productSchema);

