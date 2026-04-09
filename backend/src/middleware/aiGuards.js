// backend/src/middleware/aiGuards.js
const rateLimit = require("express-rate-limit");

const INJECTION_PATTERNS = [
  "ignore your instructions",
  "ignore previous",
  "disregard the above",
  "you are now",
  "act as if",
  "forget everything",
  "new instructions",
];

function validateNoteInput(req, res, next) {
  const content = req.body?.content || req.noteContent;

  if (!content || content.trim().length === 0) {
    return res.status(400).json({
      error:   "input_required",
      message: "Note content is required to generate a summary.",
    });
  }

  const inputLower = content.toLowerCase();
  if (INJECTION_PATTERNS.some((p) => inputLower.includes(p))) {
    console.warn({ event: "injection_attempt_blocked", userId: req.user?.id, timestamp: new Date().toISOString() });
    return res.status(400).json({
      error:   "invalid_input",
      message: "Input contains unsupported content.",
    });
  }

  if (content.length > 8000) {
    req.truncated   = true;
    req.noteContent = content.slice(0, 8000);
  }

  next();
}

function validatePlacementInput(req, res, next) {
  const { rounds, questions } = req.body || {};
  if (!rounds || !questions) {
    return res.status(400).json({
      error:   "fields_required",
      message: "Placement structuring requires rounds and questions fields.",
    });
  }
  next();
}

const aiRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max:      20,
  keyGenerator: (req) => req.user?.userId || req.ip,
  handler: (req, res) => {
    res.status(429).json({
      error:      true,
      message:    "AI request limit reached. Try again in 60 minutes.",
      statusCode: 429,
      retryAfter: 3600,
    });
  },
  standardHeaders: true,
  legacyHeaders:   false,
  validate: { 
    ip: false,
    keyGeneratorIpFallback: false 
  }
});

module.exports = { validateNoteInput, validatePlacementInput, aiRateLimiter };
