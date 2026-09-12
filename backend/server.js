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


app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/university', universityRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    platform: 'SamadhanSetu - Jharkhand Citizen & Community Problem Redressal Platform',
    status: 'Operational',
    timestamp: new Date().toISOString(),
    stack: {
      frontend: 'React + Vite',
      backend: 'Node.js + Express.js',
      database: 'MongoDB (Mongoose)',
      auth: 'JWT + bcrypt',
      api: 'REST API',
    },
  });
});


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found.`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Connect to Database and start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[Server] SamadhanSetu Backend Server running on http://localhost:${PORT}`);
  });
};

startServer();
