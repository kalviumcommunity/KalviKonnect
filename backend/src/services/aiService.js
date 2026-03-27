// backend/src/services/aiService.js
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL_NAME     = "openai/gpt-4o-mini";

async function generateResponse(prompt, systemMsg = "You are a helpful assistant.") {
  const controller = new AbortController();
  const timeout    = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(OPENROUTER_URL, {
      method:  "POST",
      signal:  controller.signal,
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type":  "application/json",
        "HTTP-Referer":  "https://kalvikonnect.onrender.com",
        "X-Title":       "KalviKonnect",
      },
      body: JSON.stringify({
        model:       MODEL_NAME,
        max_tokens:  1000,
        temperature: 0,
        messages: [
          { role: "system", content: systemMsg },
          { role: "user",   content: prompt },
        ],
      }),
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`OpenRouter error ${response.status}: ${errorBody}`);
    }

    const data    = await response.json();
    const usage   = data.usage || {};
    const content = data.choices?.[0]?.message?.content;

    // Token logging — non-negotiable for cost visibility
    console.log({
      event:            "ai_token_usage",
      model:            MODEL_NAME,
      promptTokens:     usage.prompt_tokens     ?? 0,
      completionTokens: usage.completion_tokens ?? 0,
      totalTokens:      usage.total_tokens      ?? 0,
      timestamp:        new Date().toISOString(),
    });

    if (!content) throw new Error("Empty response from LLM");

    return { success: true, data: { result: content } };

  } catch (err) {
    clearTimeout(timeout);

    if (err.name === "AbortError") {
      return {
        success:  false,
        fallback: true,
        message:  "AI analysis unavailable. Please try again shortly.",
      };
    }

    throw err;
  }
}

module.exports = { generateResponse };
