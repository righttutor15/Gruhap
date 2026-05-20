const { google } = require('googleapis');
const OpenAI = require('openai');

// Initialize Clients
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const youtube = google.youtube({ version: 'v3', auth: process.env.YOUTUBE_API_KEY });

// Global state to mimic the Python global variables
let savedRoadmap = "No roadmap generated yet.";

const curriculumInstructions = `You are the 'Gruhap Academic Engine', an elite AI tutor and career mentor.

Your primary directive is to match the conversational quality, visual formatting, intelligence, and engagement level of premium AI systems like ChatGPT/Gemini/Claude, while remaining highly educational and practical.

====================================================
RESPONSE STYLE RULES
====================================================

====================================================
1. SMART RESPONSE LENGTH CLASSIFIER (CRITICAL)
====================================================

FIRST classify the user query into one of these categories:

-----------------------------------
A) MICRO ANSWER
-----------------------------------
Use for:
- definitions
- one-line concepts
- direct factual questions
- "what is..."
- "define..."
- "who is..."
- "meaning of..."
- "full form of..."

Response Rules:
- Maximum 80-120 words
- Give concise explanation
- Avoid long examples
- Avoid unnecessary sections
- Only use:
  - short definition
  - maybe 1 tiny example

Examples:
- What is gravity?
- Define democracy.
- What is SEO?
- Meaning of inflation.

-----------------------------------
B) SHORT EXPLANATION
-----------------------------------
Use for:
- comparisons
- basic conceptual understanding
- "difference between"
- "how does"
- "why does"

Response Rules:
- 150-300 words
- Use small headings
- 2-4 bullet points
- 1 practical example

Examples:
- Difference between AI and ML
- How does blockchain work?
- Why is digital marketing important?

-----------------------------------
C) DETAILED EXPLANATION
-----------------------------------
Use for:
- "explain in detail"
- "teach me"
- "roadmap"
- "complete guide"
- interview prep
- career planning
- exam preparation

Response Rules:
- structured response
- headings
- examples
- case studies if relevant
- roadmap if required
- interview insights if relevant

Examples:
- Teach me digital marketing
- Explain neural networks mathematically
- Create AI roadmap
- Explain DBMS in detail

-----------------------------------
D) ROADMAP / LEARNING MODE
-----------------------------------
Use when user asks:
- roadmap
- learning plan
- beginner to advanced
- syllabus
- study plan

Response Rules:
- phases
- milestones
- timeline if asked
- projects/resources
- progression flow

IMPORTANT:
DO NOT generate long responses for MICRO ANSWER queries.
This is a strict rule.

DO NOT over-explain simple questions.
If the user's question can be answered in under 100 words,
DO NOT generate a long article.

====================================================
2. VISUAL FORMATTING (CRITICAL)
====================================================

Responses must look visually attractive and premium.

Rules:
- Use proper spacing between paragraphs.
- Use Markdown headers.
- Use bullet points frequently.
- Use bold text for key concepts.
- Avoid giant text walls.
- Use sections like:
  ### Concept
  ### Example
  ### Real-World Use
  ### Interview Insight
  ### Quick Summary

Add spacing after every major paragraph.

====================================================
3. INDIA-FIRST CONTEXT
====================================================

Always prioritize Indian context/examples whenever possible.

Examples:
- Currency → Use ₹ Rupees instead of Dollars.
- Startup examples → Zomato, Swiggy, Ola, Flipkart, Zerodha, Paytm.
- Business examples → Reliance, TCS, Infosys, HDFC.
- Marketing examples → Myntra campaigns, IPL ads, Jio marketing.
- Economy examples → UPI, Aadhaar, ONDC.

Only use foreign examples if they are globally iconic:
- Uber
- Airbnb
- Amazon
- Netflix
- Apple

====================================================
4. CASE STUDIES (WHEN RELEVANT)
====================================================

If topic relates to:
- Startups
- Business
- Marketing
- AI
- Product growth
- Branding
- Entrepreneurship

Then include:
### Mini Case Study

Examples:
- Uber surge pricing
- Airbnb growth
- Zomato notifications
- Netflix recommendation engine
- Swiggy delivery optimization

Keep case studies SHORT and practical.

====================================================
5. REAL-WORLD EXPLANATIONS
====================================================

Always connect theory with practical usage.

Example:
Instead of only defining SEO,
also explain:
"Why companies like Flipkart and Amazon invest heavily in SEO."

====================================================
6. EXAM + INTERVIEW MODE
====================================================

If the user asks academic topics:
- Focus on exam-ready explanations.
- Add short summaries.

If the user asks career/professional topics:
- Focus on industry understanding.
- Add practical examples.

====================================================
7. PROACTIVE LEARNING FLOW
====================================================

End educational responses with:

If you want, I can also:
- Give interview questions on this topic.
- Provide real-world examples.
- Create a beginner-to-advanced roadmap.
- Suggest projects related to this.
- Recommend best YouTube lectures.

====================================================
8. YOUTUBE CONTEXT
====================================================

When generating YouTube query:
- Prefer long educational lectures.
- Prefer English videos.
- Prefer trusted educators/platforms.
- Avoid shorts/reels.
- Avoid clickbait.

====================================================
9. RESPONSE TONE
====================================================

Your tone should feel:
- Intelligent
- Friendly
- Professional
- Motivating
- Human-like

Avoid robotic textbook responses.

====================================================
10. NO EMOJIS
====================================================

Do NOT use emojis.

Use:
- spacing
- headers
- bullets
- clean formatting

for attractiveness.

====================================================
11. MATHEMATICAL FORMAT
====================================================

DOUBLE ESCAPE all LaTeX backslashes.

Correct:
\\\\frac
\\\\times
\\\\sin

====================================================
12. JSON OUTPUT FORMAT (STRICT)
====================================================

Return ONLY valid JSON.

Schema:
{
  "subject": "Detected subject",
  "level": "Difficulty level or learning stage",
  "memory_snapshot": "Short memory summary",
  "youtube_query": "Highly contextual YouTube search query. If the user asks for concepts, search for lectures. If the user asks for previous year questions (PYQs) or exam prep, output a query like '[Topic] previous year questions solved lectures'. Only output null if the request is purely conversational.",
  "response": "CRITICAL: Must be a single flat Markdown string containing your entire output. NEVER output a nested dictionary, object, or array here."
}`;

const parseDuration = (duration) => {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;
    const hours = parseInt(match[1] || 0);
    const minutes = parseInt(match[2] || 0);
    const seconds = parseInt(match[3] || 0);
    return hours * 3600 + minutes * 60 + seconds;
};

// Generate a 3-5 word Title using OpenAI model
const generateChatTitle = async (firstMessage) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "Generate a 3-5 word, highly specific chat title based on the user's initial message. Use Title Case and do not include any punctuation or quotation marks."
                },
                {
                    role: "user",
                    content: firstMessage
                }
            ],
            max_tokens: 15,
            temperature: 0.3
        });
        return response.choices[0].message.content.trim().replace(/^["']|["']$/g, '');
    } catch (error) {
        console.error("Chat title generation failed:", error);
        return null;
    }
};

// Production-grade JSON repair system.
const robustJsonLoad = (rawText) => {
    if (!rawText) {
        throw new Error("Empty response");
    }

    let text = rawText.trim();

    // Remove markdown wrappers
    text = text.replace(/^```json/g, "");
    text = text.replace(/^```/g, "");
    text = text.replace(/```$/g, "");
    text = text.trim();

    // Extract first valid JSON object
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start !== -1 && end !== -1) {
        text = text.substring(start, end + 1);
    }

    // JSON requires escaped backslashes for LaTeX (e.g. \frac -> \\frac)
    text = text.replace(/(?<!\\)\\(?![\\/"bfnrtu])/g, "\\\\");

    // Fix unterminated strings
    const quoteCount = (text.match(/"/g) || []).length;
    if (quoteCount % 2 !== 0) {
        text += '"';
    }

    // Fix missing braces
    const openBraces = (text.match(/\{/g) || []).length;
    const closeBraces = (text.match(/\}/g) || []).length;
    if (closeBraces < openBraces) {
        text += "}".repeat(openBraces - closeBraces);
    }

    try {
        return JSON.parse(text);
    } catch (e) {
        // Last resort cleanup
        try {
            const cleaned = text.replace(/\n/g, "\\n");
            return JSON.parse(cleaned);
        } catch (innerError) {
            throw new Error(`JSON Repair Failed: ${e.message}. Raw: ${text.substring(0, 1000)}`);
        }
    }
};

const fetchYoutubeVideos = async (query, maxResults = 2) => {
    if (!process.env.YOUTUBE_API_KEY) {
        return [["YouTube API Key missing", "Please set your environment variable."]];
    }

    try {
        // Enforce strict English instructional delivery and bypass regional bias
        const searchRes = await youtube.search.list({
            part: 'snippet',
            q: `${query} in english -shorts -reels`,
            type: 'video',
            videoEmbeddable: 'true',
            maxResults: 12,
            relevanceLanguage: 'en',
            regionCode: 'US'
        });

        const videoIds = searchRes.data.items.map(item => item.id.videoId).filter(Boolean);
        if (videoIds.length === 0) return [];

        const videoRes = await youtube.videos.list({
            part: 'snippet,statistics,contentDetails,status',
            id: videoIds.join(','),
        });

        const rankedVideos = [];
        const currentTime = new Date();
        const trustedChannels = [
            "physics wallah", "unacademy", "khan academy", "vedantu", "fuseschool",
            "simplilearn", "gate smashers", "zerodha varsity", "pranjal kamra",
            "rachana ranade", "finnovationz", "groww", "asset yogi"
        ];

        for (const item of videoRes.data.items) {
            const status = item.status || {};
            if (status.privacyStatus !== "public") {
                continue;
            }

            const duration = parseDuration(item.contentDetails.duration);
            if (duration < 240) continue; // Skipped under 4 minutes

            const snippet = item.snippet;
            const title = snippet.title.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
            const channel = snippet.channelTitle.toLowerCase();
            const titleLower = title.toLowerCase();

            // Filter out non-academic files or promotional teasers
            if (["short", "#shorts", "reel", "status", "live", "song", "trailer", "vlog", "news"].some(x => titleLower.includes(x))) {
                continue;
            }

            const link = `https://www.youtube.com/watch?v=${item.id}`;
            const viewCount = parseInt(item.statistics.viewCount || 0);

            const pubDate = new Date(snippet.publishedAt);
            const ageDays = Math.max((currentTime - pubDate) / (1000 * 60 * 60 * 24), 1);

            const priorityBoost = trustedChannels.some(t => channel.includes(t)) ? 1 : 0;
            const velocityScore = (viewCount / ageDays) + (priorityBoost * 5000);

            rankedVideos.push({ title, link, score: velocityScore });
        }

        rankedVideos.sort((a, b) => b.score - a.score);
        return rankedVideos.slice(0, maxResults).map(v => [v.title, v.link]);

    } catch (error) {
        console.error("YouTube API Error:", error);
        return [["API Error", error.message]];
    }
};

const callVoiceModel = async (voiceInstructions, voiceMessages) => {
    const hasAnthropicKey = process.env.ANTHROPIC_API_KEY &&
        process.env.ANTHROPIC_API_KEY.trim() !== "" &&
        !process.env.ANTHROPIC_API_KEY.startsWith("your_");

    if (hasAnthropicKey) {
        try {
            const AnthropicClass = require('@anthropic-ai/sdk');
            const anthropic = new AnthropicClass({ apiKey: process.env.ANTHROPIC_API_KEY });

            // Format voiceMessages to match Anthropic API format: [{role: "user"|"assistant", content: string}]
            const anthropicMessages = voiceMessages.filter(m => m.role === "user" || m.role === "assistant");

            const response = await anthropic.messages.create({
                model: process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001",
                max_tokens: 2500,
                temperature: 0.6,
                system: voiceInstructions,
                messages: anthropicMessages
            });

            return response.content[0].text;
        } catch (error) {
            console.error("Anthropic API call failed, falling back to OpenAI:", error);
        }
    }

    // Fallback to OpenAI gpt-4o-mini
    const messages = [
        { role: "system", content: voiceInstructions },
        ...voiceMessages.filter(m => m.role === "user" || m.role === "assistant")
    ];

    const oaiResp = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messages,
        max_tokens: 2500,
        temperature: 0.6
    });

    return oaiResp.choices[0].message.content;
};

const specializedReply = async (req, res) => {
    const { userMsg, history = [] } = req.body;

    try {
        // ── STEP 1: THE BRAIN (GPT-4o-mini) ──────────────────────────────────────
        const routerInstructions = `You are the 'Brain' of the specialized curriculum engine.
Your objective is to manage the current pedagogical state and return clean JSON payloads.

CURRENT SYLLABUS TO FOLLOW:
${savedRoadmap}

INTENT DETECTION RULES (CRITICAL):
- "dynamic_intake": Triggered IMMEDIATELY when a user introduces a new subject/domain to learn. The engine must establish a supportive conversational baseline to capture or confirm their Target Timeframe and baseline Knowledge Level before generating any roadmap.
- "roadmap_generation": Triggered ONLY when the user explicitly requests to build or draft the structured syllabus AND we fully possess their target duration and current skill level.
- "lesson_delivery": Triggered when the user requests to "start", "begin", "next", or progress directly to a defined module/chapter within the existing active roadmap.
- "doubt_solving": Triggered when the user asks specific follow-up questions, requests deeper contextual examples, or introduces queries outside linear roadmap progression.

JSON SCHEMA (Strictly return valid JSON):
{
  "intent": "dynamic_intake | roadmap_generation | lesson_delivery | doubt_solving",
  "subject": "The overarching skill/domain",
  "current_topic": "The precise topic/chapter to address right now (or 'Initial Intake')",
  "youtube_query": "A highly targeted YouTube search string for the current concept. Output 'null' if the intent is dynamic_intake or roadmap_generation.",
  "memory_snapshot": "Max 20 words. Clearly identify the NEXT sequential curriculum node."
}`;

        // CRITICAL COST FIX: Reduced context retention from 12 to 4 turns to match Python updates
        const slicedHistory = history.slice(-4);

        const oaiMessages = [{ role: "system", content: routerInstructions }];
        slicedHistory.forEach(m => {
            if (m.u && (m.snapshot || m.topic || m.memory_snapshot || m.current_topic)) {
                oaiMessages.push({ role: "user", content: m.u });
                const snapshot = m.snapshot || m.memory_snapshot || 'N/A';
                const topic = m.topic || m.current_topic || 'N/A';
                oaiMessages.push({ role: "assistant", content: `Context: ${snapshot} | Taught: ${topic}` });
            }
        });
        oaiMessages.push({ role: "user", content: userMsg });

        const oaiResp = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: oaiMessages,
            temperature: 0.1,
            response_format: { type: "json_object" }
        });

        const data = robustJsonLoad(oaiResp.choices[0].message.content);

        // ── STEPS 2 & 3 ──────────────────────────────────────────────────────────
        const intent = data.intent || 'lesson_delivery';
        const ytQuery = data.youtube_query;

        // Build Voice system prompt based on exact pedagogical intent
        let pedagogicalRules = "";
        if (intent === "dynamic_intake") {
            pedagogicalRules = `
PEDAGOGICAL RULES (CRITICAL):
1. CONVERSATIONAL INTAKE: Greet the student warmly. Engage them in a brief, highly conversational check-in to capture their exact baseline Knowledge Level and Target Timeframe before generating any curriculum modules. Ask exactly two structured intake questions.
2. STRICT BRANDING BAN: Do NOT output third-party corporate trademarks (such as 'Zerodha' or 'Varsity') to describe your pedagogical style. Refer strictly to your output as a 'customized, modular learning roadmap'.
3. ABSOLUTE EMOJI BAN: You are strictly forbidden from generating emojis, decorative icons, or graphical unicode symbols anywhere in your response text or headers.
4. SPACING & SCANNABILITY: Ensure clear vertical line spacing buffers between all distinct paragraphs. Utilize clean bold text for emphasis. Ensure clean punctuation closure at the end of your sign-off menu.`;
        } else if (intent === "roadmap_generation") {
            pedagogicalRules = `
PEDAGOGICAL RULES (CRITICAL):
1. PROFESSIONAL BLUEPRINT: Construct a deep, rigorous domain plan tailored strictly to the user's explicit timeline and target proficiency level. Ensure absolute neutrality—do NOT output third-party corporate brand names as stylistic descriptions.
2. ABSOLUTE EMOJI BAN: You are strictly forbidden from generating emojis, decorative icons (including clock or timeline symbols), or graphical unicode symbols anywhere in the response text, module headers, or chapter items.
3. MODULAR HIERARCHY: Structure the syllabus cleanly into primary 'Modules'. Under each Module, list logical, sequential 'Chapters' covering all core sub-topics.
4. EXACT FORMATTING: Enforce a clean markdown hierarchy:
   ### Module 1: [Module Title]
   - **Chapter 1:** [Descriptive Chapter Title]
   - **Chapter 2:** [Descriptive Chapter Title]
5. PACING DISTRIBUTION: Explicitly append expected completion durations cleanly next to the primary Module headers based on their defined timeline using standard text only (e.g., 'Expected Duration: 2 weeks').
6. MENU: Conclude with a crisp sign-off asking if they are ready to initiate Module 1, Chapter 1. Avoid conversational filler.`;
        } else if (intent === "lesson_delivery") {
            pedagogicalRules = `
PEDAGOGICAL RULES (CRITICAL):
1. STRICT BUDGET & PACING (CRITICAL): To prevent token exhaustion and keep unit costs lean for chat interfaces, keep your core conceptual explanation highly focused and concise (maximum 400 words). Prioritize high-impact foundational concepts over exhaustive textbook prose.
2. ABSOLUTE EMOJI BAN: You are strictly forbidden from generating emojis, graphical icons, or decorative unicode symbols anywhere in your text, tables, bullet points, or headers.
3. MANDATORY SPACING & POINTERS: Enforce clear vertical blank space breaks between all distinct paragraphs. Break down multi-part workflows or parameters using clear, bold-headed bullet points.
4. DEEP INDIAN LOCALIZATION: 
   - Native financial metrics MUST be formatted in Indian Rupees (₹) and regional numbering systems (Lakhs/Crores). Avoid default USD ($) metrics unless illustrating direct cross-border comparisons.
   - Weave brief, real-world case studies and examples anchoring principles directly within dynamic Indian business ecosystems (e.g., Reliance Retail, Tata Motors, UPI digital stacks, Infosys, Zomato).
5. MANDATORY CHAPTER EXECUTION RIGOR: Every single chapter delivery MUST strictly contain these three dedicated sections, kept highly compact:
   - Focused Conceptual Explanation: Deliver clear, high-impact foundational theory.
   - ### Localized Case Study: Provide a compact, real-world scenario illustrating applied friction and business resolution within an active enterprise environment.
   - ### Practical Implementation: Provide explicit, step-by-step actionable guidance illustrating real-world execution. If generating observation tables or assignment grids, keep rows strictly minimal and bounded to ensure complete rendering.
6. STRATEGIC DIAGRAMMATIC ENHANCEMENT (MANDATORY): Whenever delivering foundational instruction detailing architectural mechanisms, multi-step structural workflows, or core market platforms where visual comprehension is highly beneficial to learn or understand the system, you MUST insert an inline context tag formatted strictly as 

[Image of X]

(where X is a precise, highly searchable query). Strategically place these tags immediately before or after the structural explanation to provide downstream UI rendering hooks.
7. NO MANUAL LINKS: Never output literal web URLs directly inside text blocks. Rely entirely on automated resource ingestion.
8. LATEX INTEGRATION: Ensure formal mathematical variables utilize double-escaped boundaries ($$) to support exact compilation rendering downstream.
9. MENU: Conclude directly by asking if they are prepared to transition to the Next Topic defined in the active roadmap.`;
        } else { // doubt_solving strictly
            pedagogicalRules = `
PEDAGOGICAL RULES (CRITICAL):
1. STRICT SCOPE & BUDGET CONTROL: The user is asking a specific clarification, requesting examples, or solving a localized doubt. Answer their specific query directly, concisely, and immediately.
2. ABSOLUTE EMOJI BAN: You are strictly forbidden from generating emojis, graphical icons, or decorative unicode symbols anywhere in your text.
3. ABSOLUTE GENERATION CEILING: Cap your core conceptual explanation to a maximum of 150 words. Do NOT generate multi-column markdown comparison tables, extensive step-by-step implementation workflows, or exhaustive instructional checklists unless the user explicitly requests those specific structural formatting types in their immediate prompt.
4. FORMATTING & LOCALIZATION: Maintain clean vertical spacing between brief paragraphs and utilize simple bolded bullet points for core takeaways. Ensure any monetary figures default strictly to Indian Rupees (₹) and regional enterprise context.
5. MENU: Conclude directly by asking if they are ready to return to the structured active roadmap path.`;
        }

        const voiceInstructions = `You are the 'Voice' of the specialized learning engine.
Your job is to guide the student based on the curriculum state provided below.

STATE:
- Intent: ${intent}
- Subject: ${data.subject || 'General'}
- Active Node to Address: ${data.current_topic || 'Initial Intake'}
- Next Defined Step: ${data.memory_snapshot || 'N/A'}

${pedagogicalRules}`;

        const voiceMessages = [];
        slicedHistory.forEach(m => {
            if (m.u && m.a) {
                voiceMessages.push({ role: "user", content: m.u });
                voiceMessages.push({ role: "assistant", content: m.a });
            }
        });
        voiceMessages.push({ role: "user", content: userMsg });

        // Chat title generation — only on the first message
        const isFirstMessage = !history.some(m => m.a);
        const titlePromise = isFirstMessage
            ? generateChatTitle(userMsg)
            : Promise.resolve(null);

        // 🚀 Parallel execution of YouTube, Voice response, and Chat Title
        const [ytResults, voiceText, chatTitle] = await Promise.all([
            ytQuery && ytQuery.toLowerCase() !== "null"
                ? fetchYoutubeVideos(ytQuery)
                : Promise.resolve([]),
            callVoiceModel(voiceInstructions, voiceMessages),
            titlePromise
        ]);

        if (intent === "roadmap_generation") {
            savedRoadmap = voiceText;
        }

        const responseData = {
            ...data,
            response: voiceText,
            snapshot: data.memory_snapshot,
            topic: data.current_topic,
            youtube_results: ytResults,
            chatTitle
        };

        res.json(responseData);

    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

const curriculumReply = async (req, res) => {
    const { userMsg, history = [] } = req.body;

    try {
        const slicedHistory = history.slice(-4);
        const oaiMessages = [{ role: "system", content: curriculumInstructions }];
        
        slicedHistory.forEach(m => {
            if (m.u && m.a) {
                oaiMessages.push({ role: "user", content: m.u });
                const assistantCleanResponse = m.a.split('\n\n### Top Recommended Videos')[0];
                oaiMessages.push({ role: "assistant", content: assistantCleanResponse });
            }
        });
        
        oaiMessages.push({ role: "user", content: userMsg });

        const oaiResp = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: oaiMessages,
            temperature: 0.3,
            response_format: { type: "json_object" }
        });

        const data = robustJsonLoad(oaiResp.choices[0].message.content);
        const ytQuery = data.youtube_query;

        // Chat title generation — only on the first message
        const isFirstMessage = !history.some(m => m.a);
        const titlePromise = isFirstMessage
            ? generateChatTitle(userMsg)
            : Promise.resolve(null);

        // Parallel execution of YouTube, Chat Title
        const [ytResults, chatTitle] = await Promise.all([
            ytQuery && ytQuery.toLowerCase() !== "null"
                ? fetchYoutubeVideos(ytQuery)
                : Promise.resolve([]),
            titlePromise
        ]);

        const responseData = {
            ...data,
            response: data.response,
            snapshot: data.memory_snapshot,
            topic: data.current_topic || data.subject,
            youtube_results: ytResults,
            chatTitle
        };

        res.json(responseData);

    } catch (error) {
        console.error("Curriculum Chat Error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

const tutorReply = async (req, res) => {
    const { botType } = req.body;
    if (botType === 'curriculum') {
        return curriculumReply(req, res);
    } else {
        return specializedReply(req, res);
    }
};

module.exports = {
    tutorReply,
    curriculumReply
};
