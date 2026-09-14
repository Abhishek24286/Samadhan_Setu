import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import problemRoutes from './routes/problemRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import universityRoutes from './routes/universityRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Dynamic Allowed Origins for CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL // Vercel frontend URL set in Render Environment Variables
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy violation: ${origin} not allowed`));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/university', universityRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    platform: 'SamadhanSetu - Jharkhand Citizen & Community Problem Redressal Platform',
    status: 'Operational',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    stack: {
      frontend: 'React + Vite',
      backend: 'Node.js + Express.js',
      database: 'MongoDB (Mongoose)',
      auth: 'JWT + bcrypt',
      api: 'REST API',
    },
  });
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found.`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Database Connection and Server Boot
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`[Server] SamadhanSetu Backend Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('[Server Start Error]:', error);
    process.exit(1);
  }
};

startServer();