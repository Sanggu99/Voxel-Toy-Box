
import { GoogleGenAI } from "@google/genai";
import { LANDMARKS } from "../constants";
import { LandmarkType } from "../types";

// In-memory cache to prevent redundant API calls
const factCache: Record<string, string> = {};

export async function getLandmarkFact(landmarkName: string): Promise<string> {
  // Check cache first
  if (factCache[landmarkName]) {
    return factCache[landmarkName];
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide one extremely interesting, short (max 2 sentences) fun fact about the ${landmarkName}. Make it sound exciting!`,
      config: {
        temperature: 0.8,
      }
    });

    const text = response.text || "";
    if (text) {
      factCache[landmarkName] = text;
      return text;
    }
    throw new Error("Empty response");
  } catch (error: any) {
    console.warn("Gemini Service Exception:", error.message || error);
    
    // Find the landmark in constants to get the fallback
    const landmarkEntry = Object.values(LANDMARKS).find(l => l.name === landmarkName);
    const fallback = landmarkEntry ? landmarkEntry.fallbackFact : "This landmark is an architectural marvel of its time!";
    
    // If it's a quota error, we don't cache the fallback so we can try again later, 
    // but for the current session, it provides a seamless UI.
    return fallback;
  }
}
