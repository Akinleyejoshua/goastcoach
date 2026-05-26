import { GoogleGenerativeAI, Content, Part } from '@google/generative-ai';

const GEMINI_API_KEY:any = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY is not set. AI features will not work.');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

export async function analyzeImage(imageBase64: string, userContext: {
  sport: string;
  position: string;
  experienceLevel: string;
}): Promise<any> {
  const prompt = `You are a professional ${userContext.sport} coach analyzing a player's technique.

Player Context:
- Sport: ${userContext.sport}
- Position/Role: ${userContext.position}
- Experience Level: ${userContext.experienceLevel}

Analyze the uploaded image of the player's stance/technique and provide a structured coaching report.

Respond with ONLY a valid JSON object in this exact format (no markdown, no extra text):
{
  "overallScore": <number between 1-10>,
  "strengths": ["<specific thing done well>", "<another strength>", "<third strength if applicable>"],
  "areasToImprove": ["<specific technical flaw with plain English explanation>", "<second area>", "<third area>"],
  "priorityFix": "<the single most important correction for the next session>",
  "drillSuggestion": "<one concrete drill or exercise to address the priority fix>",
  "confidenceLevel": "Low" | "Medium" | "High"
}

Focus on:
- Body alignment and posture
- Weight distribution
- Position-specific mechanics
- Common technical flaws for ${userContext.experienceLevel} level ${userContext.position}
- Provide actionable, beginner-friendly explanations if experience level is Beginner`;

  try {
    const imagePart: Part = {
      inlineData: {
        data: imageBase64,
        mimeType: 'image/jpeg',
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Parse JSON from response (remove markdown if present)
    const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/{[\s\S]*}/);
    const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : text;
    const parsed = JSON.parse(jsonString);

    return parsed;
  } catch (error) {
    console.error('Gemini analysis error:', error);
    throw error;
  }
}

export async function chatAboutSession(
  message: string,
  userContext: {
    sport: string;
    position: string;
    experienceLevel: string;
  },
  feedback: any,
  chatHistory: Array<{ role: string; content: string }>
): Promise<string> {
  const prompt = `You are a professional ${userContext.sport} coach helping a ${userContext.experienceLevel} level ${userContext.position}.

Recent coaching feedback provided:
${JSON.stringify(feedback, null, 2)}

Chat history (most recent first):
${chatHistory.slice(-10).map((m) => `${m.role}: ${m.content}`).join('\n')}

User question: ${message}

Provide a helpful, concise coaching response. Keep it practical and tailored to their level. If the question is about exercises or drills, give specific, actionable advice.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text() || 'Sorry, I could not generate a response.';
  } catch (error) {
    console.error('Gemini chat error:', error);
    throw error;
  }
}
