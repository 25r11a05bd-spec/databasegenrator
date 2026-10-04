import express from 'express';
import cors from 'cors';
import { ENV } from './config/env';
import authRoutes from './api/routes/auth';
import databaseRoutes from './api/routes/database';
import groqRoutes from './api/routes/groq';
import healthRoutes from './api/routes/health';

const app = express();

// Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/database', databaseRoutes);
app.use('/api/groq', groqRoutes);
app.use('/api/health', healthRoutes);

// 404 JSON handler for unmatched routes
app.use((_req: express.Request, res: express.Response) => {
  res.status(404).json({ error: 'Endpoint not found on backend API' });
});

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: err?.message || 'Internal Server Error' });
});

export default app;
