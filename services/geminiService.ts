import { GoogleGenAI, Type } from "@google/genai";
import { ParsedResume, ScoringResult } from "../types";

// Assume API_KEY is available in the environment from which this script is run.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

// Schemas are defined client-side for direct API calls
const resumeSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    email: { type: Type.STRING },
    phone: { type: Type.STRING },
    summary: { type: Type.STRING, description: "A brief professional summary." },
    skills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    experience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          company: { type: Type.STRING },
          duration: { type: Type.STRING },
          responsibilities: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ["title", "company", "duration"],
      },
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          degree: { type: Type.STRING },
          institution: { type: Type.STRING },
          year: { type: Type.STRING },
        },
        required: ["degree", "institution"],
      },
    },
  },
  required: ["name", "email", "skills", "experience", "education", "summary"],
};

const scoringSchema = {
    type: Type.OBJECT,
    properties: {
        score: { type: Type.NUMBER, description: "A score from 0 to 100." },
        strengths: { type: Type.STRING },
        weaknesses: { type: Type.STRING },
        reasoning: { type: Type.STRING, description: "Detailed reasoning for the score." }
    },
    required: ["score", "strengths", "weaknesses", "reasoning"]
};

// Helper function to convert a File object to a base64 string for the Gemini API
const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const parseResume = async (file: File): Promise<ParsedResume> => {
  try {
    const filePart = await fileToGenerativePart(file);
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [
        {text: "Extract the following information from the provided resume document. If a field is not found, use a reasonable placeholder or null."},
        filePart
      ]},
      config: {
        responseMimeType: 'application/json',
        responseSchema: resumeSchema
      }
    });
    
    const text = response.text;
    if (!text) {
        throw new Error("Empty response received from Gemini API during resume parsing.");
    }

    try {
        const parsedJson = JSON.parse(text);
        return parsedJson as ParsedResume;
    } catch (e) {
        console.error("JSON Parse Error:", e, text);
        throw new Error("Failed to parse resume data. The model returned invalid JSON.");
    }

  } catch (error) {
    console.error("Error parsing resume with Gemini:", error);
    // Re-throw to be handled by the UI
    throw error;
  }
};

export const scoreCandidate = async (parsedResume: ParsedResume, jobDescription: string): Promise<ScoringResult> => {
  try {
    const prompt = `
      Please act as an expert HR analyst. Score the following candidate's resume against the provided job description.
      The score should be from 0 to 100, where 100 is a perfect match.
      Provide a summary of strengths, weaknesses, and detailed reasoning for the score.

      JOB DESCRIPTION:
      ---
      ${jobDescription}
      ---

      CANDIDATE'S PARSED RESUME:
      ---
      ${JSON.stringify(parsedResume, null, 2)}
      ---
    `;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: scoringSchema,
        temperature: 0.2
      }
    });

    const text = response.text;
    if (!text) {
        throw new Error("Empty response received from Gemini API during candidate scoring.");
    }

    try {
        const parsedJson = JSON.parse(text);
        return parsedJson as ScoringResult;
    } catch (e) {
        console.error("JSON Parse Error:", e, text);
        throw new Error("Failed to parse scoring results. The model returned invalid JSON.");
    }

  } catch (error) {
    console.error("Error scoring candidate with Gemini:", error);
    throw error;
  }
};