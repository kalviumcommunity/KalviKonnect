const axios = require('axios');
const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('path');

// Use a clean axios instance to avoid global interceptors/headers
const axiosClient = axios.create();


const MIME_MAP = {
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.txt': 'text/plain'
};

/**
 * Prepares a file (from URL or local path) for Gemini multimodal input.
 */
async function prepareMultimodalData(fileUrl) {
  const fileParts = [];
  let extractedText = "";

  if (!fileUrl) return { fileParts, extractedText };

  try {
    let buffer;
    let contentType;

    const isLocal = !fileUrl.startsWith('http') && !fileUrl.startsWith('https');

    if (isLocal) {
      // Local file handling
      const relativePath = fileUrl.startsWith('/') ? `.${fileUrl}` : fileUrl;
      const absolutePath = path.resolve(process.cwd(), relativePath);
      
      console.log(`[AI UTILS] Reading local file: ${absolutePath}`);
      if (!fs.existsSync(absolutePath)) {
        throw new Error(`Local file not found at ${absolutePath}`);
      }
      
      buffer = fs.readFileSync(absolutePath);
      const ext = path.extname(absolutePath).toLowerCase();
      contentType = MIME_MAP[ext] || 'application/octet-stream';
    } else {
      // Remote URL handling
      console.log(`[AI UTILS] Downloading remote file: ${fileUrl}`);
      const fileResponse = await axiosClient.get(fileUrl, { 
        responseType: 'arraybuffer',
        timeout: 15000 
      });
      buffer = fileResponse.data;
      contentType = fileResponse.headers['content-type'] || 'application/pdf';
    }



    // Prepare for Gemini inlineData
    fileParts.push({
      inlineData: {
        data: Buffer.from(buffer).toString('base64'),
        mimeType: contentType
      }
    });

    // Extract text for prompt augmentation (especially for PDFs)
    if (contentType.includes('pdf')) {
      try {
        const pdfData = await pdf(buffer);
        if (pdfData.text && pdfData.text.length > 50) {
          const cleanText = pdfData.text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, "").trim();
          if (cleanText.length > 50 && !cleanText.startsWith("%PDF")) {
            extractedText = cleanText.slice(0, 5000);
          }
        }
      } catch (pdfErr) {
        console.warn(`[AI UTILS] PDF text extraction failed (will rely on vision): ${pdfErr.message}`);
      }
    }
  } catch (err) {
    console.error(`[AI UTILS ERROR] Multi-modal processing failed for ${fileUrl}: ${err.message}`);
  }

  return { fileParts, extractedText };
}


module.exports = { prepareMultimodalData };
