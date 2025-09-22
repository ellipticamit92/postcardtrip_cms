import { GoogleGenAI } from "@google/genai";

let client: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (client) return client;

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined in .env");
  }

  client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return client;
}
