import { ROLE_ADMIN, ROLE_SUPER_ADMIN } from "../constants/roles.js";
import User from "../models/User.js";
import uploadFile from "../utils/fileUploader.js";
import authService from "./auth.service.js";

const createUser = async (data) => {
  return await authService.register(data);
};

const getAllUsers = async (query) => {
  // query.sort comes from the URL as a string, but Mongoose's .sort() expects a sort specification, such as an object.
  const sort = query.sort ? JSON.parse(query.sort) : { price: 1 };
  const limit = query.limit ?? 10;
  const offset = query.offset ?? 0;

  const { email, name, phone } = query;

  const filters = {};

  // const filters = category ? { category } : {};

  if (email) {
    filters.email = {
      $regex: email,
      $options: "i",
    };
  }

  if (name) {
    filters.name = {
      $regex: name,
      $options: "i",
    };
  }

  if (phone) {
    filters.phone = {
      $regex: phone,
      $options: "i",
    };
  }

  const users = await User.find(filters).sort(sort).limit(limit).skip(offset);

  return users;
};

const getUserById = async (id, authUser) => {
  if (authUser._id !== id && !authUser.roles.includes(ROLE_ADMIN)) {
    throw { 
      status: 403,
      message: "Access denied.",
    };
  }
  return await User.findById(id);
};

const updateUser = async (id, input, authUser) => {
  const isOwner = authUser._id.toString() === id.toString();
  const isAdmin = authUser.roles?.includes(ROLE_ADMIN);

  if (!isOwner && !isAdmin) {
    throw {
      status: 403,
      message: "Access denied.",
    };
  }

  return await User.findByIdAndUpdate(
    id,
    {
      name: input?.name,
      phone: input?.phone,
      address: input?.address, 
      isActive: input?.isActive,
    },
    {
      returnDocument: "after"
    },
  );
};

const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

const updateProfileImage = async (id, file) => {
  const uploadedFiles = await uploadFile([file]);
  return await User.findByIdAndUpdate(
    id,
    {
      profileImageUrl: uploadedFiles[0].url,
    },
    {returnDocument: "after"},
  );
};

const updateUserRoles = async (id, roles, authUser) => {
  // check if SUPER_ADMIN: Only super admin can update role to admin
  if (
    (roles.includes(ROLE_ADMIN) || roles.includes(ROLE_SUPER_ADMIN)) &&
    !authUser.roles.includes(ROLE_SUPER_ADMIN)
  ) {
    throw {
      status: 403,
      message: "Access denied.",
    };
  }
  return await User.findByIdAndUpdate(id, { roles }, {returnDocument: "after"});
};

export default {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateProfileImage,
  updateUserRoles,
};
