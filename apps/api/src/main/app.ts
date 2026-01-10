import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import { ErrorHandlerMiddleware } from '@/infrastructure/http/express/middlewares/ErrorHandlerMiddleware';
import { RequestIdMiddleware } from '@/infrastructure/http/express/middlewares/RequestIdMiddleware';
import authRoutes from '../infrastructure/http/express/routes/auth.routes';
import playlistRoutes from '../infrastructure/http/express/routes/playlist.routes';
import syncRoutes from '../infrastructure/http/express/routes/sync.routes';
import userRoutes from '../infrastructure/http/express/routes/user.route';

dotenv.config();

const app = express();
const isDev = process.env.NODE_ENV === 'dev';

app.use(RequestIdMiddleware.handle);
app.use(cors({ origin: true }));
app.use(express.json());

if (isDev) {
  const swaggerUi = require('swagger-ui-express');
  const { generateOpenApiDocument } = require('@/infrastructure/docs/swaggerGenerator');
  const openApiDocument = generateOpenApiDocument();

  app.get('/docs/json', (_req, res) => {
    res.json(openApiDocument);
  });

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Harmonia.io API Docs',
  }));
}


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

