import express from "express"

import pageController from "../controllers/page.controller.js";

const router = express.Router();

router.get("/", pageController.getHomeView);

router.get("/products", pageController.getProductsView);

export default router;