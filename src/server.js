import express from 'express';
import dotenv from "dotenv";
import multer from "multer";

import productRoute from "./routes/product.route.js";
import userRoute from "./routes/user.route.js"
import authRoute from "./routes/auth.route.js"
import orderRoute from "./routes/order.route.js";

import config from "./config/config.js"
import connectDB from "./config/database.js";
import bodyParser from 'body-parser';
import logger from './middlewares/logger.js';
import auth from "./middlewares/auth.js"
import connectCloudinary from './config/cloudinary.js';
import promptAi from './utils/ai.js';

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

connectDB();
connectCloudinary();

app.use(express.json());
app.use(bodyParser.json());
app.use(logger);

app.get("/", (req, res) => {
    res.send("Hello world! I am Saroj Gumanju.");
});

app.use("/api/products", upload.array('images', 5), productRoute);

app.use("/api/users", auth, upload.single("image"), userRoute);

app.use("/api/auth", authRoute);

app.use("/api/orders", auth,  orderRoute);

app.post("/api/ai", async (req, res) => {
    console.log("AI route reached");
    console.log("Request body:", req.body);

    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({
                success: false,
                message: "Prompt is required.",
            });
        }

        console.log("Calling Gemini API...");

        const result = await promptAi(prompt);

        console.log("Gemini response received");

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("AI error message:", error?.message);
        console.error("AI error stack:", error?.stack);
        console.error("AI error status:", error?.status);

        return res.status(500).json({
            success: false,
            message: error?.message || "Failed to generate AI response.",
        });
    }
});

app.listen(config.port, config.hostname, () => {
    console.log(`Server is running at http://${config.hostname}:${config.port}`);
});

