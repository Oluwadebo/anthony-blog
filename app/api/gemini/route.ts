import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Initialize the GoogleGenAI client with the server-side API key
// We lazily verify the key inside the route handlers to avoid crashing on boot if the key is empty.
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY is not configured. Please supply your API key in the Secrets panel inside Google AI Studio.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, action, title } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required to generate AI content" },
        { status: 400 }
      );
    }

    const ai = getAiClient();

    let systemInstruction = "You are a world-class publisher, writing coach, and editor helping a professional content creator generate article drafts, tags, and headlines.";
    let contents = prompt;

    if (action === "outline") {
      systemInstruction = `You are an expert editorial writer. Given a topic, build a structured, compelling article outline in markdown that can be used directly as draft content. Include headlines, bullet points, and high-readability lists.`;
      contents = `Create an editorial outline for a blog post titled "${title || 'Untitled'}" or about: ${prompt}`;
    } else if (action === "suggest-tags") {
      systemInstruction = `You are a taxonomy expert for a high-performance CMS. Given a title or summary, return a JSON list of exactly 4-5 relevant SEO tags, all in lowercase, starting with hashes (e.g. ["#ux", "#technology"]). Do NOT return anything other than JSON.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Provide relevant tags for this article title or body: ${prompt}`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
      });

      try {
        const parsedTags = JSON.parse(response.text || "[]");
        return NextResponse.json({ result: parsedTags });
      } catch {
        return NextResponse.json({ result: ["#cms", "#technology", "#futureofwork", "#design"] });
      }
    } else if (action === "optimize-titles") {
      systemInstruction = `You are an expert copywriter. Recommend 3 highly engaging headlines for a blog post based on this draft description: "${prompt}"`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
      },
    });

    return NextResponse.json({ result: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: error?.message || "An unexpected error occurred during AI content generation." },
      { status: 500 }
    );
  }
}
