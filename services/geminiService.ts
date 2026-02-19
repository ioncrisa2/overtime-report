import { GoogleGenAI } from "@google/genai";
import { OvertimeEntry } from "../types";

const createClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const geminiService = {
  async generateSummary(entries: OvertimeEntry[], userName: string): Promise<string> {
    const client = createClient();
    if (!client) {
      return "API Key missing. Please provide a valid Gemini API Key.";
    }

    if (entries.length === 0) {
      return "No entries available to summarize.";
    }

    // Format data for the prompt
    const tasksList = entries.map(e => 
      `- Date: ${e.date}, Hours: ${e.durationHours}, Task: ${e.taskDescription}`
    ).join('\n');

    const prompt = `
      Act as an HR assistant. Analyze the following overtime records for employee ${userName}.
      
      Tasks:
      ${tasksList}

      Please provide a concise, professional summary tailored for a manager. 
      Highlight the key areas they worked on, the total impact, and if there are any patterns (e.g., working mostly on specific holidays or urgent tickets).
      Keep the tone professional and encouraging.
    `;

    try {
      const response = await client.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return response.text || "Could not generate summary.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Error generating summary. Please try again later.";
    }
  }
};
