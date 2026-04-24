const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const MODEL = "llama-3.3-70b-versatile";
const TITLE_MODEL = "llama-3.1-8b-instant"; // Faster, cheaper model for titles

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `You are Gruhap AI — an expert academic tutor specializing in JEE, NEET, and K12 subjects (Physics, Chemistry, Mathematics, Biology).

Your guidelines:
- Give clear, step-by-step explanations for problems.
- Use simple language that a student can understand.
- When solving math or physics problems, show the working.
- For chemistry, explain mechanisms or reactions clearly.
- For biology, use accurate terminology with easy definitions.
- Use markdown formatting for better readability (bold, lists, code blocks).
- CRITICAL: For all important mathematical formulas, chemical reactions, and step-by-step calculations, use block math syntax ($$...$$) to ensure they are highlighted in dedicated cards. Only use inline math ($...$) for small variables within a sentence.`;

export async function sendMessageToGroq(
  userMessage: string,
  conversationHistory: Message[] = []
): Promise<string> {
  if (!GROQ_API_KEY || GROQ_API_KEY === "your_groq_api_key_here") {
    return "⚠️ Groq API key is not configured. Please add your API key to the `.env` file as `VITE_GROQ_API_KEY=your_key`.";
  }

  const messages: Message[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...conversationHistory.slice(-10), // Keep last 10 messages for context
    { role: "user", content: userMessage },
  ];

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 4096,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Groq API Error:", response.status, errorData);

      if (response.status === 401) {
        return "⚠️ Invalid API key. Please check your Groq API key in the `.env` file.";
      }
      if (response.status === 429) {
        return "⏳ Rate limit reached. Please wait a moment and try again.";
      }
      return "Something went wrong. Please try again.";
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Groq API fetch error:", error);
    return "🔌 Network error. Please check your internet connection and try again.";
  }
}

export async function generateChatTitle(firstMessage: string): Promise<string> {
  if (!GROQ_API_KEY || GROQ_API_KEY === "your_groq_api_key_here") {
    return firstMessage.slice(0, 30) + (firstMessage.length > 30 ? "..." : "");
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: TITLE_MODEL,
        messages: [
          {
            role: "system",
            content: "Analyze the user's intent and provide a professional, concise title (max 5 words) that summarizes the core topic of the conversation. If it's a simple greeting like 'hi' or 'how are you', use 'General Inquiry' or 'Greeting'. If it's academic, identify the subject and topic (e.g., 'Chemistry: Redox Reactions'). Return ONLY the plain text title, no quotes, no punctuation.",
          },
          { role: "user", content: firstMessage },
        ],
        temperature: 0.5,
        max_tokens: 20,
      }),
    });

    if (!response.ok) {
      return firstMessage.slice(0, 30) + (firstMessage.length > 30 ? "..." : "");
    }

    const data = await response.json();
    const title = data.choices?.[0]?.message?.content?.trim();
    return title || firstMessage.slice(0, 30) + (firstMessage.length > 30 ? "..." : "");
  } catch {
    return firstMessage.slice(0, 30) + (firstMessage.length > 30 ? "..." : "");
  }
}
