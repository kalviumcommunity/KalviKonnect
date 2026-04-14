/**
 * Utility to build structured prompts for Gemini AI.
 * Ensures model responses follow strict JSON patterns for easy parsing.
 */

/**
 * Builds prompt for summarizing study notes.
 * @param {object} note - The note object containing title and content.
 */
exports.buildNoteSummaryPrompt = (note) => ({
  systemMsg: "You are an expert academic tutor. Your goal is to analyze study notes (from text OR attached images/PDFs) and return structured JSON summaries.",
  userPrompt: `Analyze the study note titled "${note.title}".
IMPORTANT: If the note contains text below, use it. If there is an attached file (PDF/Image), analyze its content as well.
Return exactly this JSON format (no markdown, no code fences):
{
  "summary": "3-4 sentences concise summary of the key concepts.",
  "keyPoints": ["point 1", "point 2", "point 3", "point 4", "point 5"],
  "examTopics": ["topic 1", "likely question 1", "topic 2", "likely question 2"]
}

TEXT CONTENT:
${note.content ? note.content.substring(0, 3000) : "No text content provided. Please analyze based on the attached file if available."}`
});

/**
 * Builds prompt for structuring raw placement experiences.
 * @param {string} rawText - Raw student-written experience.
 * @param {string} company - Target company name.
 * @param {string} role - Target role.
 */
exports.buildPlacementStructurePrompt = (rawText, company, role) => ({
  systemMsg: "You are a tech career expert. Your goal is to turn raw student descriptions or uploaded documents into structured interview guides.",
  userPrompt: `Analyze this placement experience for ${role} at ${company}.
IMPORTANT: Use the text below AND look at any attached files (like screenshots or PDFs of interview rounds) to provide a complete breakdown.
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

RAW EXPERIENCE TEXT:
${rawText ? rawText.substring(0, 2500) : "No text content provided. Please analyze based on the attached file if available."}`
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
