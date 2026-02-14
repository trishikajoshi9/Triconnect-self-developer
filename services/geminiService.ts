
import { GoogleGenAI, Type } from "@google/genai";

// Initialize GoogleGenAI inside functions to ensure it always uses the most up-to-date API key.
export async function generateVibeCode(prompt: string, mood: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate a high-quality, professional code snippet based on the following vibe: "${prompt}". 
    The tone should be ${mood}. Provide the code in a clear format. 
    Explain briefly what the code does. Output as JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          code: { type: Type.STRING },
          language: { type: Type.STRING },
          explanation: { type: Type.STRING },
        },
        required: ["title", "code", "language", "explanation"]
      },
      // Using thinkingBudget for complex text tasks (Gemini 3 Pro series)
      thinkingConfig: { thinkingBudget: 32768 }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("The model did not return any text content.");
  }

  // Extract text and trim to prepare for JSON parsing
  const jsonStr = text.trim();
  return JSON.parse(jsonStr);
}

export async function getLearningRoadmap(topic: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Create a comprehensive learning roadmap for: ${topic}. 
    Break it down into phases with key concepts to master.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          phases: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                phaseName: { type: Type.STRING },
                milestones: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["phaseName", "milestones"]
            }
          }
        },
        required: ["topic", "phases"]
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("The model did not return any text content.");
  }

  const jsonStr = text.trim();
  return JSON.parse(jsonStr);
}
