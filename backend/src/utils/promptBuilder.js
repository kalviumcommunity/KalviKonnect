/**
 * Utility to build structured prompts for Gemini AI.
 * Ensures model responses follow strict JSON patterns for easy parsing.
 */

/**
 * Builds prompt for summarizing study notes.
 * @param {object} note - The note object containing title and content.
 */
exports.buildNoteSummaryPrompt = (note) => ({
  systemMsg: "You are an expert academic tutor for Kalvium students. Your goal is to analyze study notes and return structured JSON summaries.",
  userPrompt: `Analyze the following study note titled "${note.title}".
Return exactly this JSON format (no markdown, no code fences):
{
  "summary": "3-4 sentences concise summary of the key concepts.",
  "keyPoints": ["point 1", "point 2", "point 3", "point 4", "point 5"],
  "examTopics": ["topic 1", "likely question 1", "topic 2", "likely question 2"]
}

CONTENT:
${note.content.substring(0, 3000)}`
});

/**
 * Builds prompt for structuring raw placement experiences.
 * @param {string} rawText - Raw student-written experience.
 * @param {string} company - Target company name.
 * @param {string} role - Target role.
 */
exports.buildPlacementStructurePrompt = (rawText, company, role) => ({
  systemMsg: "You are a senior career advisor specialized in tech placement preparation. Your goal is to turn raw student descriptions into structured interview guides.",
  userPrompt: `Analyze this placement experience for the role of ${role} at ${company}.
Return exactly this JSON format (no markdown, no code fences):
{
  "roundBreakdown": [
    { "round": "Round Title", "focus": "Technical/HR focus points", "tips": "Actionable advice for this round" }
  ],
  "prepTopics": ["topic 1", "topic 2", "topic 3"],
  "prepChecklist": [
    { "category": "Technical/DSA", "items": ["array basics", "system design"] }
  ]
}

RAW EXPERIENCE:
${rawText.substring(0, 2500)}`
});

/**
 * Helper to safely parse AI JSON responses.
 * Handles cases where the AI might include markdown or extra characters.
 */
exports.parseAIJson = (text) => {
  try {
    // Attempt to extract JSON if it's wrapped in triple backticks (common with LLMs)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const cleanText = jsonMatch ? jsonMatch[0] : text;
    
    return {
      success: true,
      data: JSON.parse(cleanText)
    };
  } catch (err) {
    console.error("[PARSER ERROR] Failed to parse AI response:", err.message);
    return {
      success: false,
      error: "Malformed AI response structure."
    };
  }
};
