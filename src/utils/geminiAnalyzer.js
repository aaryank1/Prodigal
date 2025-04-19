import { GoogleGenAI } from '@google/genai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

function constructPrompt(transcriptData) {
  let basePrompt = `
You are an expert call center analyst. Analyze the following call transcript JSON and provide results in a structured JSON format. 
The transcript contains a conversation between an Agent and a Customer.

Here's the transcript data:
${JSON.stringify(transcriptData, null, 2)}

Analyze this transcript and return a JSON object with the following structure:
{
  "qualityMetrics": {
    "overtalk": {
      "percentage": <number>,
      "overtalkSeconds": <number>,
      "totalCallDuration": <number>,
      "instances": [
        {
          "speakers": <string>,
          "duration": <number>,
          "start": <number>,
          "end": <number>,
          "text": <string>
        }
      ]
    },
    "silence": {
      "percentage": <number>,
      "silenceSeconds": <number>,
      "totalCallDuration": <number>,
      "instances": [
        {
          "start": <number>,
          "end": <number>,
          "duration": <number>
        }
      ]
    }
  }
}

Output only valid JSON with no additional text or explanation.
`;

  return basePrompt;
}

export async function analyzeThroughGemini(transcriptData) {
    try {
      const prompt = constructPrompt(transcriptData);
      const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY})
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: {
          text: prompt
        }
      })

      const responseText = response.text;      

      let cleanedResponse = responseText;
      if (responseText.includes('```')) {
        cleanedResponse = responseText.replace(/```(json)?|```/g, '').trim();
      }

      // Parse the cleaned JSON response
      const parsedResponse = JSON.parse(cleanedResponse);
      // Ensure the response has the expected structure
      const result = {
        profanityDetection: parsedResponse.profanityDetection || { agentProfanity: [], borrowerProfanity: [] },
        privacyViolations: parsedResponse.privacyViolations || [],
        qualityMetrics: parsedResponse.qualityMetrics || {
          overtalk: { percentage: 0, overtalkSeconds: 0, totalCallDuration: 0, instances: [] },
          silence: { percentage: 0, silenceSeconds: 0, totalCallDuration: 0, instances: [] }
        }
      };
      
      return result;
    } catch (error) {
      console.error("Error with Gemini API:", error);
      throw new Error(`Gemini API error: ${error.message || "Unknown error"}`);
    }
}
  