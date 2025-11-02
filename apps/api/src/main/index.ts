import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import authRoutes from '../infrastructure/http/express/routes/auth.routes';
import bullBoardRoutes from '../infrastructure/http/express/routes/bull-board.routes';
import syncRoutes from '../infrastructure/http/express/routes/sync.routes';
import { startWorkers } from '../infrastructure/queue/workers';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: true }));
app.use(express.json());

app.use(authRoutes);
app.use(syncRoutes);
app.use(bullBoardRoutes);

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (_req, res) => {
  res.json({
    message: '🎵 Harmonia.io API',
    status: 'online',
    version: '1.0.0'
  });
});

startWorkers();

app.listen(PORT, () => {
  console.log('');
  console.log('🎵 Harmonia.io rodando!');
  console.log(`📍 http://127.0.0.1:${PORT}`);
  console.log('');
});