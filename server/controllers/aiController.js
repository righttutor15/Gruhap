const { google } = require('googleapis');
const OpenAI = require('openai');
const Anthropic = require('@anthropic-ai/sdk');
const axios = require('axios');

// Initialize Clients
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const youtube = google.youtube({ version: 'v3', auth: process.env.YOUTUBE_API_KEY });

// Global state (in a real app, this should be in a database)
let savedRoadmap = "No roadmap generated yet.";

const parseDuration = (duration) => {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;
    const hours = parseInt(match[1] || 0);
    const minutes = parseInt(match[2] || 0);
    const seconds = parseInt(match[3] || 0);
    return hours * 3600 + minutes * 60 + seconds;
};

const fetchYoutubeVideos = async (query, maxResults = 2) => {
    if (!process.env.YOUTUBE_API_KEY) {
        return [["YouTube API Key missing", "Please set your environment variable."]];
    }

    try {
        const searchRes = await youtube.search.list({
            part: 'snippet',
            q: query + " -shorts",
            type: 'video',
            videoEmbeddable: 'true',
            maxResults: 15,
        });

        const videoIds = searchRes.data.items.map(item => item.id.videoId);
        if (videoIds.length === 0) return [];

        const videoRes = await youtube.videos.list({
            part: 'snippet,statistics,contentDetails',
            id: videoIds.join(','),
        });

        const rankedVideos = [];
        const currentTime = new Date();

        for (const item of videoRes.data.items) {
            const duration = parseDuration(item.contentDetails.duration);
            if (duration < 240) continue; // Skip videos under 4 minutes

            const title = item.snippet.title.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
            const link = `https://www.youtube.com/watch?v=${item.id}`;
            const viewCount = parseInt(item.statistics.viewCount || 0);
            const pubDate = new Date(item.snippet.publishedAt);
            const ageDays = Math.max((currentTime - pubDate) / (1000 * 60 * 60 * 24), 1);

            const velocityScore = viewCount / ageDays;
            rankedVideos.push({ title, link, score: velocityScore });
        }

        rankedVideos.sort((a, b) => b.score - a.score);
        return rankedVideos.slice(0, maxResults).map(v => [v.title, v.link]);

    } catch (error) {
        console.error("YouTube API Error:", error);
        return [["API Error", error.message]];
    }
};

const tutorReply = async (req, res) => {
    const { userMsg, history = [] } = req.body;

    try {
        // ── STEP 1: THE BRAIN (GPT-4o-mini) ──────────────────────────────────────
        const routerInstructions = `You are the 'Brain' of the Gruhap Engine.
Your ONLY job is to manage the curriculum state and output structured JSON. 

CURRENT SYLLABUS TO FOLLOW:
${savedRoadmap}

INTENT DETECTION RULES (CRITICAL):
- "roadmap_generation": Use ONLY when the user explicitly asks to CREATE or MODIFY a plan, syllabus, or timeline.
- "lesson_delivery": Use when the user says "start", "begin", "next", OR when they ask to jump to a specific phase/topic that already exists in the current syllabus.
- "doubt_solving": Use if the user asks a specific question, asks for examples, or needs clarification.

JSON SCHEMA (Strictly return valid JSON):
{
  "intent": "roadmap_generation | lesson_delivery | doubt_solving",
  "subject": "The overarching skill",
  "current_topic": "The exact topic from the syllabus to be taught right now",
  "youtube_query": "A highly specific YouTube search query for the current topic. Use 'null' ONLY for roadmap_generation.",
  "memory_snapshot": "Max 20 words. State what the NEXT topic will be."
}`;

        const oaiMessages = [{ role: "system", content: routerInstructions }];
        // Only include history entries that have both user and assistant content
        history.filter(m => m.u && m.topic).slice(-12).forEach(m => {
            oaiMessages.push({ role: "user", content: m.u });
            oaiMessages.push({ role: "assistant", content: `Context: ${m.snapshot} | Taught: ${m.topic}` });
        });
        oaiMessages.push({ role: "user", content: userMsg });

        const oaiResp = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: oaiMessages,
            temperature: 0.1,
            response_format: { type: "json_object" }
        });

        const data = JSON.parse(oaiResp.choices[0].message.content);

        // ── STEPS 2, 3 & 4 run in PARALLEL ───────────────────────────────────────
        // All three depend on Step 1 but are independent of each other.
        const intent = data.intent || 'lesson_delivery';
        const ytQuery = data.youtube_query;

        // Build Claude Voice system prompt
        let pedagogicalRules = "";
        if (intent === "roadmap_generation") {
            pedagogicalRules = `
PEDAGOGICAL RULES (CRITICAL):
1. STRICT TEMPLATE: You must output ONLY a clean, multi-phase roadmap.
2. TIMELINE PACING: ONLY add timeframes IF the user explicitly asks.
3. EXACT FORMATTING: ### Phase 1: [Name] \n - **Topic 1:** [Name]
4. NO EXTRA FLUFF: Do not explain the phases.
5. THE MENU: End by asking if they are ready to start.
6. NO EMOJIS.`;
        } else {
            pedagogicalRules = `
PEDAGOGICAL RULES (CRITICAL):
1. ORGANIC STRUCTURE: Use a mix of short paragraphs and bolded bullet points.
2. NO META-HEADERS.
3. COST CONTROL: Max 450 words.
4. REAL-WORLD ANALOGIES: Include a "### Real-World Example:" section.
5. THE MENU: End with a proactive menu.
6. NO EMOJIS.`;
        }

        const voiceInstructions = `You are the 'Voice' of the Gruhap Learning Engine.
Your job is to guide the student based on the curriculum state provided below.

STATE:
- Intent: ${intent}
- Subject: ${data.subject}
- Topic to Teach Now: ${data.current_topic}
- Next Topic in Roadmap: ${data.memory_snapshot}

${pedagogicalRules}`;

        const claudeMessages = [];
        // Only include history entries that have both user and assistant content
        history.filter(m => m.u && m.a).slice(-12).forEach(m => {
            claudeMessages.push({ role: "user", content: m.u });
            claudeMessages.push({ role: "assistant", content: m.a });
        });
        claudeMessages.push({ role: "user", content: userMsg });

        // Chat title generation — only on the very first message of a session
        const isFirstMessage = history.length === 0;
        const titlePromise = isFirstMessage
            ? openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: `You generate short, memorable chat titles for a student AI tutor app.
Rules:
- 3-5 words only, title case
- Be specific to the actual topic (e.g. "JEE Optics Refraction" not "Physics Question")
- No punctuation or emojis at the end
- Sound like a chapter heading, not a question
Good examples: "NEET Genetics Mnemonics", "UI/UX Portfolio Review", "React Hooks Deep Dive", "Confidence Building Tips"`
                    },
                    { role: "user", content: `Generate a chat title for: "${userMsg}"` }
                ],
                max_tokens: 15,
                temperature: 0.3
            })
            : Promise.resolve(null);

        // 🚀 Fire all three in parallel
        const [ytResults, claudeResp, titleResp] = await Promise.all([
            ytQuery && ytQuery.toLowerCase() !== "null"
                ? fetchYoutubeVideos(ytQuery)
                : Promise.resolve([]),
            anthropic.messages.create({
                model: "claude-3-5-haiku-latest",
                max_tokens: 1000,
                temperature: 0.6,
                system: voiceInstructions,
                messages: claudeMessages
            }),
            titlePromise
        ]);

        const finalLessonText = claudeResp.content[0].text;
        const chatTitle = titleResp
            ? titleResp.choices[0].message.content.trim().replace(/^["']|["']$/g, '')
            : null;

        if (intent === "roadmap_generation") {
            savedRoadmap = finalLessonText;
        }

        const responseData = {
            ...data,
            response: finalLessonText,
            snapshot: data.memory_snapshot,
            topic: data.current_topic,
            youtube_results: ytResults,
            chatTitle // null if not first message; frontend uses it to set the sidebar title
        };

        res.json(responseData);

    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

module.exports = {
    tutorReply
};
