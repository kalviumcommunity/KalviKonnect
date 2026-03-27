// backend/src/utils/promptBuilder.js

function buildNoteSummaryPrompt(note) {
  const systemMsg = [
    "You are an academic assistant for Kalvium engineering students.",
    "Summarize study notes clearly and concisely for exam preparation.",
    "Be factual and grounded only in the provided content.",
    "Always return valid JSON — no markdown fencing, no prose outside the JSON object.",
  ].join(" ");

  const userPrompt = [
    `Note Title: ${note.title}`,
    `Note Content:\n${note.content}`,
    "",
    "Generate a concise summary covering the main concepts a student needs for an exam.",
    "",
    "Return valid JSON only in this exact shape:",
    `{ "summary": "string", "keyPoints": ["string"], "examTopics": ["string"] }`,
    "",
    "Constraints:",
    "- Do not add information not present in the note.",
    "- Maximum 5 key points.",
    "- Maximum 4 exam topics.",
    "- If the note is too short to summarize meaningfully, set summary to null.",
    "- Return only the JSON object. No backticks, no explanation text.",
  ].join("\n");

  return { systemMsg, userPrompt };
}

function buildPlacementStructurePrompt(placement) {
  const systemMsg = [
    "You are a placement preparation assistant for Kalvium engineering students.",
    "Your job is to structure raw placement experience data into a clear, actionable preparation guide.",
    "Be factual and grounded only in the provided content.",
    "Always return valid JSON — no markdown fencing, no prose outside the JSON object.",
  ].join(" ");

  const userPrompt = [
    `Company: ${placement.company}`,
    `Role: ${placement.role}`,
    `Rounds: ${JSON.stringify(placement.rounds)}`,
    `Questions Asked: ${JSON.stringify(placement.questions)}`,
    `Tips from candidate: ${placement.tips || "None provided"}`,
    "",
    "Structure this placement experience into a round-by-round preparation guide.",
    "",
    "Return valid JSON only in this exact shape:",
    `{
  "company": "string",
  "role": "string",
  "rounds": [{ "roundName": "string", "focus": "string", "prepTopics": ["string"] }],
  "preparationChecklist": ["string"],
  "keyTakeaway": "string"
}`,
    "",
    "Constraints:",
    "- Do not fabricate details not present in the input.",
    "- preparationChecklist must have 3 to 6 items.",
    "- Return only the JSON object. No backticks, no explanation text.",
  ].join("\n");

  return { systemMsg, userPrompt };
}

function parseAIJson(rawContent) {
  try {
    const cleaned = rawContent
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();
    return { success: true, data: JSON.parse(cleaned) };
  } catch {
    return {
      success: false,
      error:   "parse_error",
      message: "AI returned an unparseable response. Please try again.",
      raw:     rawContent,
    };
  }
}

module.exports = { buildNoteSummaryPrompt, buildPlacementStructurePrompt, parseAIJson };
