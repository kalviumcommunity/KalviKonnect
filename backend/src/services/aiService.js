const { GoogleGenerativeAI } = require("@google/generative-ai");

// Configuration: uses gemini-1.5-flash for speed/cost efficiency
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Unified AI Response Generator
 * @param {string} prompt - The user prompt
 * @param {string} systemMsg - Optional system instruction for the AI model
 * @returns {Promise<{success: boolean, text?: string, fallback?: boolean, error?: string}>}
 */
const generateResponse = async (prompt, systemMsg = "You are a helpful academic assistant for KalviKonnect.") => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemMsg
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Token usage logging for cost visibility - non-negotiable for production
    const usage = response.usageMetadata;
    console.log(`[AI LOG] tokens used — prompt: ${usage?.promptTokenCount || 'N/A'}, candidates: ${usage?.candidatesTokenCount || 'N/A'}`);

    if (!text) {
      throw new Error("Empty response received from Gemini.");
    }

    return { 
      success: true, 
      text 
    };

  } catch (err) {
    console.error("[AI ERROR] Gemini integration failed:", err.message);
    
    // Fallback: never crash the main request. Returns graceful failure for frontend handling.
    return { 
      success: false, 
      fallback: true, 
      error: err.message || "AI Analysis unavailable" 
    };
  }
};

module.exports = { generateResponse };
