import { GoogleGenAI, Type } from "@google/genai";
import { HistoricalDataPoint, EntryPointAnalysis } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. Analysis feature will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getEntryPointAnalysis = async (
  symbol: string,
  name: string,
  historicalData: HistoricalDataPoint[]
): Promise<EntryPointAnalysis | null> => {
  if (!API_KEY) {
    return null;
  }

  const prompt = `
    You are an expert stock market technical analyst providing insights for educational purposes only.
    Analyze the following 30-day historical price and volume data for the Indian stock: ${name} (${symbol}).

    Data:
    ${JSON.stringify(historicalData.map(d => ({ date: d.date, price: d.price, volume: d.volume})))}

    Perform a detailed technical analysis based ONLY on the data provided, focusing on three key areas:
    1.  **MACD (Moving Average Convergence Divergence):** Infer the MACD status. Is there a bullish (MACD line crosses above signal line) or bearish (MACD crosses below) signal? If it's unclear, state it's neutral. Provide a brief reason.
    2.  **Fibonacci Retracement:** Identify the high and low price points in the 30-day period. Calculate the key Fibonacci retracement levels (0.236, 0.382, 0.5, 0.618, 0.786) based on this range. These levels often act as support or resistance.
    3.  **Volume Analysis:** Analyze the volume trend over the last 30 days. Is the volume generally increasing, decreasing, or stable? Does volume confirm the price trend (e.g., high volume on up days in an uptrend)?

    Based on this three-factor analysis, provide:
    - An 'overallSummary' of the stock's current technical posture.
    - A list of 2-3 potential 'entryPoints' (price levels) for a medium-term investment, with a simple reason for each, referencing your analysis.

    This is for informational purposes only and is not financial advice.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallSummary: {
              type: Type.STRING,
              description: "A brief summary of the stock's technical posture based on all indicators.",
            },
            macdAnalysis: {
              type: Type.OBJECT,
              properties: {
                signal: { type: Type.STRING, enum: ["BULLISH", "BEARISH", "NEUTRAL"] },
                reason: { type: Type.STRING },
              },
              required: ["signal", "reason"],
            },
            fibonacciAnalysis: {
              type: Type.OBJECT,
              properties: {
                levels: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      level: { type: Type.STRING },
                      price: { type: Type.NUMBER },
                    },
                    required: ["level", "price"],
                  },
                },
                reason: { type: Type.STRING },
              },
              required: ["levels", "reason"],
            },
            volumeAnalysis: {
                type: Type.OBJECT,
                properties: {
                    trend: { type: Type.STRING, enum: ["INCREASING", "DECREASING", "STABLE"] },
                    reason: { type: Type.STRING },
                },
                required: ["trend", "reason"],
            },
            entryPoints: {
              type: Type.ARRAY,
              description: "A list of potential entry points with price and reasoning.",
              items: {
                type: Type.OBJECT,
                properties: {
                  price: { type: Type.NUMBER },
                  reason: { type: Type.STRING },
                },
                required: ["price", "reason"],
              },
            },
          },
          required: ["overallSummary", "macdAnalysis", "fibonacciAnalysis", "volumeAnalysis", "entryPoints"],
        },
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as EntryPointAnalysis;
  } catch (error) {
    console.error("Error fetching analysis from Gemini API:", error);
    throw new Error("Failed to get analysis from Gemini. Please check your API key and try again.");
  }
};
