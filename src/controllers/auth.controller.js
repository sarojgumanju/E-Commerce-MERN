import { success } from "zod";
import authService from "../services/auth.service.js";
import jwt from "../utils/jwt.js"

const register = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    const { password, ...userWithoutPassword } = user.toObject();

    const token = jwt.createToken({
      _id: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      phone: user.phone,
      roles: user.roles,
      isActive: user.isActive,
    });

    res.cookie("authToken", token, {
      maxAge: 86400*1000
    });

    return res.status(201).json({  
      success: true,
      message: "User registered successfully",
      token,
      data: user,
      // data: userWithoutPassword,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
};

const login = async (req, res) => {
  const input = req.body;

  try {
    const user = await authService.login(req.body);
    const token = jwt.createToken({
      _id: user._id,
      name: user.name,
      email: user.email, 
      address: user.address,
      phone: user.phone,
      roles: user.roles,
      isActive: user.isActive,
    });
    
    const verifiedToken = jwt.verifyToken(token);

    res.cookie("authToken", token, {
      maxAge: 86400*1000
    });
    
    return res.status(201).json({
      success: true,
      message: "User login successfully",
      token,
      verifiedToken,
      data: user,
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "login failed",
    });
  }
};


const forgotPassword = async (req, res) => {
  try {
    const data = await authService.forgotPassword(req.body?.email)

    return res.status(201).json({  
      success: true,
      message: "Reset password link send to your email.",
      data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const data = await authService.resetPassword(req.body);
    return res.status(201).json({
      success: true, 
      message: "Password reset successfull"
    });
  } catch (error) {
    return res.status(400).json({
      success: false, 
      message: "Password reset failed."
    });
  }
}

export default { register, login, forgotPassword, resetPassword };
