require('dotenv').config();
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');
const placementRoutes = require('./routes/placementRoutes');
const hackathonRoutes = require('./routes/hackathonRoutes');
const discussionRoutes = require('./routes/discussionRoutes');
const upvoteRoutes = require('./routes/upvoteRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const feedRoutes = require('./routes/feedRoutes');

const app = express();

// Middleware
app.use(compression());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

const PORT = process.env.PORT || 5001;

// Routes
app.use('/auth', authRoutes);
app.use('/notes', noteRoutes);
app.use('/placements', placementRoutes);
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

const server = app.listen(PORT, () => {
  console.log(`Kalvi Connect API running on port ${PORT}`);
});

server.on('error', (e) => {
  console.error("Server error:", e);
});
