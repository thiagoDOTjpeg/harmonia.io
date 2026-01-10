import { logger } from '@/infrastructure/logger';
import app from './app';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  logger.info({ port: PORT }, 'Server started');
});