import express from "express";
import userController from "../controllers/user.controller.js";
import { userSchema } from "../libs/schemas/user.schema.js";
import validate from "../middlewares/validator.js";
import { ROLE_ADMIN } from "../constants/roles.js";
import roleBasedAuth from "../middlewares/roleBasedAuth.js"

const router = express.Router();

router.post("/", validate(userSchema), roleBasedAuth(ROLE_ADMIN), userController.createUser);

router.get("/", roleBasedAuth(ROLE_ADMIN), userController.getAllUsers);

router.put("/profile-image", userController.updateProfileImage);

router.get("/:id", userController.getUserById);

router.put("/:id", userController.updateUser);

router.delete("/:id", roleBasedAuth(ROLE_ADMIN), userController.deleteUser);

router.patch("/:id/roles", roleBasedAuth(ROLE_ADMIN), userController.updateUserRoles);


export default router;