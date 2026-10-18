import mongoose from "mongoose";
import { string } from "zod";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User's name is required."],
    minLength: 3,
    maxLength: 50,
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    lowercase: [true, "email should be in lowercase."],
    unique: [true, "email must be unique."],
    validate: {
      validator: (value) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(value);
      },
      message: "invalid email address",
    },
  },
  password: {
    type: String,
    required: [true, "enter your password"],
    minLength: [8, "minimum length must be 8"],
    // validate: {
    //   validator: (value) => {
    //     const passwordRegex =
    //       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    //     return passwordRegex.test(value);
    //   },
    //   message:
    //     "password must contain uppercase, lowercase, number, special characters and of minimum 8 characters length",
    // },
  },
  phone: {
    type: String,
    required: [true, "phone number is required."],
    minLength: 6,
    maxLength: 13,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  address: {
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
  roles: {
    type: [String],
    enum: ["CUSTOMER", "MERCHANT", "ADMIN", "SUPER_ADMIN"],
    default: ["CUSTOMER"],
  },
  profileImageUrl: {
    type: String
  }
});

export default mongoose.model("User", userSchema);
