import { GoogleGenAI } from "@google/genai";
import config from "../config/config.js";

const ai = new GoogleGenAI({
    apiKey: config.geminiApiKey,
});

const promptAi = async (promptMessage) => {
    console.log("Gemini utility called");
    console.log("API key configured:", Boolean(config.geminiApiKey));

    const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: promptMessage,
    });

    return response.text;
};

export default promptAi;