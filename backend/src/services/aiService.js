const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Unified Multimodal AI Response Generator with retry logic
 */
const generateResponse = async (prompt, systemMsg = 'You are a helpful academic assistant for KalviKonnect.', fileParts = []) => {
  const MODELS = [
    'gemini-3.0-flash', 
    'gemini-2.5-flash'
  ];
  const MAX_RETRIES = 2;

  for (const modelName of MODELS) {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: systemMsg
        });

        // Combined data for multimodal: prompt + any binary parts
        const combinedContent = fileParts.length > 0 ? [prompt, ...fileParts] : prompt;
        const result = await model.generateContent(combinedContent);
        
        const response = await result.response;
        const text = response.text();

        const usage = response.usageMetadata;
        console.log(`[AI LOG] Model: ${modelName} | tokens — prompt: ${usage?.promptTokenCount || 'N/A'}, output: ${usage?.candidatesTokenCount || 'N/A'}`);

        if (!text) throw new Error('Empty response from Gemini.');

        return { success: true, text };

      } catch (err) {
        const msg = err.message || '';
        console.error(`[AI DEBUG ERROR] Model: ${modelName} | Attempt: ${attempt} | Full msg: ${msg}`);

        // Extract retry-after from 429 responses
        const retryMatch = msg.match(/retry.*?(\d+)s/i);
        const waitSec = retryMatch ? parseInt(retryMatch[1]) : 5;

        // Quota Limit
        if (msg.includes('429') || msg.includes('quota')) {
          if (attempt < MAX_RETRIES) {
            console.log(`[AI] Quota exceeded. Waiting ${waitSec}s...`);
            await new Promise(r => setTimeout(r, Math.min(waitSec * 1000, 35000)));
            continue;
          }
          break;
        }

        // Region/Model Not Found
        if (msg.includes('404') || msg.includes('not found') || msg.includes('not supported')) {
          break; 
        }

        return {
          success: false,
          fallback: true,
          error: msg.includes('API_KEY') || msg.includes('403')
            ? 'AI service authentication failed. Check GEMINI_API_KEY.'
            : `AI analysis temporarily unavailable (Technical: ${msg.slice(0, 50)}...).`
        };
      }
    }
  }

  return {
    success: false,
    fallback: true,
    error: 'AI service is currently at capacity or quota reached.'
  };
};

module.exports = { generateResponse };
