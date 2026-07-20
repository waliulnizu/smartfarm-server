import { Request, Response } from "express";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

async function groqChat(messages: { role: string; content: string }[]): Promise<string> {
  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.choices[0]?.message?.content || "";
}

export async function generateCowDescription(req: Request, res: Response): Promise<void> {
  try {
    const { breed, gender, subType, weight, source, originDistrict } = req.body;

    if (!process.env.GROQ_API_KEY) {
      res.json({ description: "This is a healthy and productive animal suitable for Bangladesh's climate. With proper care and nutrition, it can provide excellent yield and growth performance." });
      return;
    }

    const prompt = `Write a professional, detailed product description for a cow with the following details:
- Breed: ${breed || "Unknown"}
- Gender: ${gender || "Unknown"}
- Category: ${subType || "Cow"}
- Weight: ${weight || "N/A"} kg
- Source: ${source || "N/A"}
- Origin: ${originDistrict || "Bangladesh"}

The description should be 3-4 sentences, suitable for a farm listing website. Sound natural and persuasive. Start with a brief intro about the cow's breed characteristics.`;

    const text = await groqChat([{ role: "user", content: prompt }]);
    res.json({ description: text });
  } catch (error: any) {
    console.error("AI description error:", error?.message || error);
    res.json({ description: "This is a healthy and productive animal suitable for Bangladesh's climate. With proper care and nutrition, it can provide excellent yield and growth performance." });
  }
}

export async function chatWithAI(req: Request, res: Response): Promise<void> {
  try {
    const { message, history } = req.body;

    if (!process.env.GROQ_API_KEY) {
      res.json({ reply: "AI service is not configured. Please set up your GROQ_API_KEY." });
      return;
    }

    const messages = [
      {
        role: "system",
        content: "You are SmartKhamar AI, an expert assistant for livestock farm management in Bangladesh. You help farmers manage cows, goats, hens, ducks, track health, understand breeding, calculate costs, and improve farm productivity. Answer in simple, helpful Bengali or English as appropriate. Be concise and practical.",
      },
      ...(history || []).map((h: any) => ({ role: h.role, content: h.text })),
      { role: "user" as const, content: message },
    ];

    const text = await groqChat(messages);
    res.json({ reply: text });
  } catch (error: any) {
    console.error("AI chat error:", error?.message || error);
    const isQuota = error?.message?.includes("429") || error?.message?.includes("rate");
    const reply = isQuota
      ? "AI rate limit পৌঁছে গেছে। কিছুক্ষণ পর আবার চেষ্টা করুন।"
      : "দুঃখিত, AI সার্ভিসে সমস্যা হচ্ছে। পরে আবার চেষ্টা করুন।";
    res.json({ reply });
  }
}
