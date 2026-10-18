
import { success } from "zod";
import userService from "../services/user.service.js";

const createUser = async (req, res) => {
    try {
        const user = await userService.createUser(req.body);

        return res.status(201).json({
            success: true,
            message: "User created successfully.",
            data: user,
        });
    } catch (error) {
        return res.status(error.status || 400).json({
            success: false,
            message: error.message || "Failed to create user.",
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers(req.query);

        return res.status(200).json({
            success: true,
            message: "Users retrieved successfully.",
            count: users.length,
            data: users,
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Failed to retrieve users.",
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userService.getUserById(id, req.user);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User retrieved successfully.",
            data: user,
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Failed to retrieve user.",
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const input = req.body;

        const user = await userService.updateUser(id, input, req.user);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found or could not be updated.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User updated successfully.",
            data: user,
        });
    } catch (error) {
        return res.status(error.status || 400).json({
            success: false,
            message: error.message || "Failed to update user.",
        });
    }
};

const updateProfileImage = async(req, res, file) => {
    console.log(req.user._id);
    try {
        const user = await userService.updateProfileImage(req.user._id, req.file);
        return res.status(200).json(
            {
                success: true, 
                message: "User's profile image updated successfully.",
                data: user
            }
        );
    } catch (error) {
        return res.status(error.status || 400).json({
            success: false,
            message: error.message || "Failed to update user's profile image."
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await userService.deleteUser(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User deleted successfully.",
        });
    } catch (error) {
        return res.status(error.status || 400).json({
            success: false,
            message: error.message || "Failed to delete user.",
        });
    }
};

const updateUserRoles = async (req, res) => {
    try {
        const user = await userService.updateUserRoles(req.params.id, req.body?.roles, req.user);
        return res.status(200).json({
            success: true, 
            message: "User role updated succesfully.", 
            user
        })
    } catch (error) {
        return res.status(error.status || 400).json({
            success: false, 
            message: error.message || "User role update unsuccessful."
        })
    }
}

export default {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    updateProfileImage,
    updateUserRoles
};
