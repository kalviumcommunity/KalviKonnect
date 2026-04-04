require("dotenv").config();
const { validateEnv } = require("./config/env");
validateEnv(); // Server refuses to start if any required var is missing

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/notes.routes');
const placementRoutes = require('./routes/placements.routes');
const hackathonRoutes = require('./routes/hackathonRoutes');
const discussionRoutes = require('./routes/discussionRoutes');
const upvoteRoutes = require('./routes/upvoteRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const feedRoutes = require('./routes/feedRoutes');
const healthRouter = require('./routes/health.route');

const app = express();

// Security and Performance Middleware
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(compression());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);
app.use(express.json());

// Specific Rate Limiter for AI endpoints to prevent cost spikes
const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000,    // 1 minute
  max: 10,                // 10 AI requests per minute per IP
  message: { 
    error: true, 
    message: "AI analysis limit reached. Please wait one minute.", 
    statusCode: 429 
  }
});

const PORT = process.env.PORT || 3000;

// Env Validation: Server refuses to start if core keys are missing
const requiredEnv = ["DATABASE_URL", "JWT_SECRET", "GEMINI_API_KEY"];
requiredEnv.forEach(key => {
  if (!process.env[key]) {
      console.error(`[CRITICAL] Missing required environment variable: ${key}`);
      process.exit(1);
  }
});

// Routes
app.use("/", healthRouter);
app.use('/auth', authRoutes);
app.use('/notes', noteRoutes);
// Apply AI rate limiter to AI-specific sub-routes
app.use('/notes/:id/ai', aiRateLimiter);
app.use('/placements', placementRoutes);
app.use('/placements/:id/ai', aiRateLimiter);
app.use('/hackathons', hackathonRoutes);
app.use('/discussions', discussionRoutes);
app.use('/upvotes', upvoteRoutes);
app.use('/bookmarks', bookmarkRoutes);
app.use('/announcements', announcementRoutes);
app.use('/feed', feedRoutes);

// 404 handler
app.use((req, res, next) => {
  const AppError = require('./utils/AppError');
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Centralized Error Handling
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(PORT, () => {
    console.log(`Kalvi Connect API running on port ${PORT}`);
  });

  server.on('error', (e) => {
    console.error("Server error:", e);
  });
}

module.exports = app;

