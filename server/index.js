import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

import fs from "fs";

dotenv.config();

// ---- Safety check ----
if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY in .env");
}

const app = express();
const port = process.env.PORT || 3000;

// ---- Middleware ----
app.use(express.json());

// ---- OpenAI client ----
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// ---- Health check ----
app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});

// ---- Core API endpoint ----
app.post("/parse-recipe", async (req, res) => {
    try {
        console.log("parsing")
        const { ocrText } = req.body;

        // 1️⃣ Validate input
        if (!ocrText || typeof ocrText !== "string") {
            return res.status(400).json({
                error: "Invalid or missing ocrText",
            });
        }

        // 2️⃣ Clean OCR text (important)
        const cleanedOCR = ocrText
            .replace(/\r/g, "")
            .replace(/[^\x00-\x7F]/g, "")
            .replace(/\s+/g, " ")
            .trim();

        // 3️⃣ Call OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0.1,
            response_format: {
                type: "json_schema",
                json_schema: {
                    name: "recipe_schema",
                    strict: true,
                    schema: {
                        type: "object",
                        additionalProperties: false,
                        properties: {
                            name: {
                                type: "object",
                                additionalProperties: false,
                                properties: {
                                    value: { type: ["string", "null"] },
                                    confidence: { type: "number", minimum: 0, maximum: 1 }
                                },
                                required: ["value", "confidence"]
                            },
                            pageNumber: {
                                type: "object",
                                additionalProperties: false,
                                properties: {
                                    value: { type: ["number", "null"] },
                                    confidence: { type: "number", minimum: 0, maximum: 1 }
                                },
                                required: ["value", "confidence"]
                            },
                            totalCookTimeMinutes: {
                                type: "object",
                                additionalProperties: false,
                                properties: {
                                    value: { type: ["number", "null"] },
                                    confidence: { type: "number", minimum: 0, maximum: 1 }
                                },
                                required: ["value", "confidence"]
                            },
                            cookTimeMinutes: {
                                type: "object",
                                additionalProperties: false,
                                properties: {
                                    value: { type: ["number", "null"] },
                                    confidence: { type: "number", minimum: 0, maximum: 1 }
                                },
                                required: ["value", "confidence"]
                            },
                            prepTimeMinutes: {
                                type: "object",
                                additionalProperties: false,
                                properties: {
                                    value: { type: ["number", "null"] },
                                    confidence: { type: "number", minimum: 0, maximum: 1 }
                                },
                                required: ["value", "confidence"]
                            },
                            servings: {
                                type: "object",
                                additionalProperties: false,
                                properties: {
                                    value: { type: ["number", "null"] },
                                    confidence: { type: "number", minimum: 0, maximum: 1 }
                                },
                                required: ["value", "confidence"]
                            },
                            ingredients: {
                                type: "array",
                                items: {
                                    type: "object",
                                    additionalProperties: false,
                                    properties: {
                                        name: {
                                            type: "object",
                                            additionalProperties: false,
                                            properties: {
                                                value: { type: ["string", "null"] },
                                                confidence: { type: "number", minimum: 0, maximum: 1 }
                                            },
                                            required: ["value", "confidence"]
                                        },
                                        quantity: {
                                            type: "object",
                                            additionalProperties: false,
                                            properties: {
                                                value: { type: ["number", "null"] },
                                                confidence: { type: "number", minimum: 0, maximum: 1 }
                                            },
                                            required: ["value", "confidence"]
                                        },
                                        unit: {
                                            type: "object",
                                            additionalProperties: false,
                                            properties: {
                                                value: { type: ["string", "null"] },
                                                confidence: { type: "number", minimum: 0, maximum: 1 }
                                            },
                                            required: ["value", "confidence"]
                                        },
                                        extraDetail: {
                                            type: "object",
                                            additionalProperties: false,
                                            properties: {
                                                value: { type: ["string", "null"] },
                                                confidence: { type: "number", minimum: 0, maximum: 1 }
                                            },
                                            required: ["value", "confidence"]
                                        }
                                    },
                                    required: ["name", "quantity", "unit", "extraDetail"]
                                }
                            }
                        },
                        required: [
                            "name",
                            "pageNumber",
                            "totalCookTimeMinutes",
                            "cookTimeMinutes",
                            "prepTimeMinutes",
                            "servings",
                            "ingredients"
                        ]
                    }
                }
            },
            messages: [
                {
                    role: "system",
                    content:
                        "Extract structured recipe data from OCR text. Give a confidence on how sure you are of each extraction from 0-1 using decimals to 2DP for example 0.95 Do not include instructions. Do not include commentary."
                },
                {
                    role: "user",
                    content: cleanedOCR
                }
            ]
        });

        // 4️⃣ Parse response
        const raw = completion.choices[0].message.content;

        let parsed;
        try {
            parsed = JSON.parse(raw);
            console.log("Raw OpenAI response:", raw);
            console.log("Parsed OpenAI response:", parsed);
            res.json(parsed);
        } catch (err) {
            console.error("Invalid JSON from OpenAI:", raw);
            return res.status(500).json({
                error: "AI returned invalid JSON",
            });
        }
    } catch (err) {
        console.error("parse-recipe error:", err);
        res.status(500).json({
            error: "Failed to parse recipe",
        });
    }
});

// ---- Start server ----
app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
});