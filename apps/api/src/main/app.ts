import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import { ErrorHandlerMiddleware } from '@/infrastructure/http/express/middlewares/ErrorHandlerMiddleware';
import authRoutes from '../infrastructure/http/express/routes/auth.routes';
import playlistRoutes from '../infrastructure/http/express/routes/playlist.routes';
import syncRoutes from '../infrastructure/http/express/routes/sync.routes';
import userRoutes from '../infrastructure/http/express/routes/user.route';

dotenv.config();

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.use(userRoutes);
app.use(authRoutes);
app.use(playlistRoutes)
app.use(syncRoutes);

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (_req, res) => {
  res.json({
    status: 'online',
    version: '1.0.0'
  });
});

app.use(ErrorHandlerMiddleware.globalErrorHandler)

export default app

