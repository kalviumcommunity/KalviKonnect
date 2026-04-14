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
const postRoutes = require('./routes/postRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const searchRoutes = require('./routes/searchRoutes');
const universitiesRoutes = require('./routes/universities.routes');
const usersRoutes = require('./routes/users.routes');
const calendarRoutes = require('./routes/calendar.routes');
const healthRouter = require('./routes/health.route');

const http = require('http');
const socketUtil = require('./utils/socket');
const path = require('path');
const app = express();

// Static Files - serve uploads directory
const uploadsPath = path.join(__dirname, '../uploads');
if (!require('fs').existsSync(uploadsPath)) require('fs').mkdirSync(uploadsPath, { recursive: true });
app.use('/uploads', express.static(uploadsPath));


// Security and Performance Middleware
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(compression());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Env Validation: Server refuses to start if core keys are missing
const requiredEnv = ["DATABASE_URL", "JWT_SECRET", "GEMINI_API_KEY"];
requiredEnv.forEach(key => {
  if (!process.env[key]) {
      console.error(`[CRITICAL] Missing required environment variable: ${key}`);
      process.exit(1);
  }
});

const PORT = process.env.PORT || 3000;

// Routes
app.use("/", healthRouter);
app.use('/auth', authRoutes);
app.use('/notes', noteRoutes);
app.use('/placements', placementRoutes);
app.use('/hackathons', hackathonRoutes);
app.use('/discussions', discussionRoutes);
app.use('/upvotes', upvoteRoutes);
app.use('/bookmarks', bookmarkRoutes);
app.use('/announcements', announcementRoutes);
app.use('/posts', postRoutes);
app.use('/notifications', notificationRoutes);
app.use('/search', searchRoutes);
app.use('/universities', universitiesRoutes);
app.use('/users', usersRoutes);
app.use('/calendar', calendarRoutes);

// 404 handler
app.use((req, res, next) => {
  const AppError = require('./utils/AppError');
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Centralized Error Handling
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  const server = http.createServer(app);
  
  // Initialize Socket.io
  socketUtil.init(server);

  server.listen(PORT, () => {
    console.log(`Kalvi Connect API (Stability V5) + Realtime running on port ${PORT}`);
  });


  server.on('error', (e) => {
    console.error("Server error:", e);
  });
}

module.exports = app;

