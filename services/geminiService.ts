
import { GoogleGenAI, Type } from "@google/genai";
import { RecommendationResponse } from "../types";

// Initialize Gemini
// CRITICAL: The API key must be process.env.API_KEY and use named parameter for apiKey
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getProductRecommendation = async (query: string, availableProducts: string[]): Promise<RecommendationResponse> => {
  try {
    const productsList = availableProducts.join(", ");
    
    const response = await ai.models.generateContent({
      // Use gemini-3-flash-preview for product recommendations (basic text task)
      model: "gemini-3-flash-preview",
      contents: `User Query: "${query}"
      
      You are a nutrition and culinary concierge for a premium dry fruit company called "KCnuts".
      We sell: ${productsList}.
      
      Based on the user's query about health goals, diet, or cooking needs, recommend 1-3 specific products from our list.
      Explain why in a short, elegant sentence (max 20 words).
      If the query is irrelevant, politely steer them back to dry fruits and nuts.
      `,
      config: {
        systemInstruction: "You are a helpful nutrition and sales assistant. Tone: Warm, Knowledgeable, Concise. Focus on health benefits, cooking uses, and snacking.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendationText: {
              type: Type.STRING,
              description: "A short, elegant explanation of the recommendation based on health or taste.",
            },
            suggestedProducts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of exact product names from the catalog that match the query.",
            },
          },
          required: ["recommendationText", "suggestedProducts"],
        },
      },
    });

    // Solely access the .text property (not a method) as per @google/genai guidelines
    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini");
    }

    return JSON.parse(text) as RecommendationResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      recommendationText: "We have a wonderful selection of premium nuts tailored for your health and taste.",
      suggestedProducts: [],
    };
  }
};
