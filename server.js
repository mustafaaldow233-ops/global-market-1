// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');

const app = express();

// Connect DB
connectDB(process.env.MONGO_URI);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS (allow your frontend origin)
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || '*',
  credentials: true
}));

// Serve uploads and public static
app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOAD_DIR || 'uploads')));
app.use('/', express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);

// fallback
app.get('/api/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Server started on', PORT));
