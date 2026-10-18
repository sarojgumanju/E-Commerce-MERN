import config from "../config/config.js";
import ResetPassword from "../models/ResetPassword.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import sendEmail from "../utils/email.js";

const register = async (data) => {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    const error = new Error("User already exists.");
    error.status = 409;
    throw error;
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(data.password, salt);

  delete data.roles;

  const newUser = await User.create({
    ...data,
    password: hashedPassword,
  });

  return newUser;
};

const login = async (data) => {
  // findOne() expects a query object, not a plain email string.
  const user = await User.findOne({
    $or: [{ email: data?.email }, { phone: data?.phone }],
  });
  if (!user) {
    throw {
      status: 404,
      message: "User not found.",
    };
  }

  if(!user.isActive){
    throw {
      status: 404,
      message: "User is inactive."
    }
  }

  const isPasswordMatch = bcrypt.compareSync(data.password, user.password);
  if (!isPasswordMatch) {
    throw {
      status: 400,
      message: "password do not match",
    };
  }

  return user;
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw {
      status: 404,
      message: "User not found.",
    };
  }

  const token = crypto.randomUUID();

  // const resetPassword = await ResetPassword.create({
  //     userId: user._id,
  //     token: token,
  // });
  // const link = `${config.appUrl}/reset-password?id=${ResetPassword._id}`;

  await ResetPassword.create({
    userId: user._id,
    token: token,
  });
  const link = `${config.appUrl}/reset-password?userId=${user._id}&token=${token}`;

  sendEmail({
    recipient: email,
    subject: "Reset Password link",
    html: `    <div
      style="
        padding: 16px;
        font-family: sans-serif;
      "
    >
      <h1>Please click the link to reset your password.</h1>
      <a
        href='${link}'
        style="
          background-color: rgb(143, 218, 243);
          color: black;
          font-size: large;
          text-decoration: none;
          padding: 16px 32px;
          border-radius: 5px;
        "
        >Reset Password</a
      >
    </div>`,
  });

  // send email with the reset password link
//   return {
//      link,
//   };
};

const resetPassword = async (input) => {
  const data = await ResetPassword.findOne({
    userId: input.userId,
    expiresAt: { $gt: Date.now() },
  }).sort({ createdAt: -1 });

  if (!data || data.token != input.token) {
    throw {
      status: 400,
      message: "Invalid or expires link",
    };
  }

  if (data.isUsed) {
    throw {
      status: 400,
      message: "Link already used",
    };
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(input.password, salt);

  await User.findByIdAndUpdate(input.userId, {
    password: hashedPassword,
  });

  await ResetPassword.findByIdAndUpdate(data._id, {
    isUsed: true,
  });

  return {
    message: "Password reset successful.",
  };
};

export default { register, login, forgotPassword, resetPassword };
