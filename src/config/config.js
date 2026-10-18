import dotenv from "dotenv"
dotenv.config();

const config = {
    appUrl: process.env.APP_URL,
    secret : process.env.SECRET,
    port : process.env.PORT || "",
    mongodbUrl : process.env.MONGODB_URL || "",
    jwtSecret: process.env.JWT_SECRET || "",
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || "", 
        apiKey: process.env.CLOUDINARY_API_KEY || "", 
        apiSecret: process.env.CLOUDINARY_API_SECRET || ""
    },
    khalti: { 
        apiUrl : process.env.KHALTI_API_URL || "",
        secretKey : process.env.KHALTI_SECRET_KEY || "",
        returnUrl: process.env.KHALTI_RETURN_URL || "",
        websiteUrl: process.env.KHALTI_WEBSITE_URL || "",
        appUrl: process.env.KHALTI_APP_URL || "",
    },
    resendEmailApiKey : process.env.RESEND_EMAIL_API_KEY || "",
};

export default config;