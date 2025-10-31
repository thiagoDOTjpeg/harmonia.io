import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import authRoutes from './routes/auth';
import meRoutes from './routes/me';


// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

app.use(authRoutes);
app.use(meRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({
    message: '🎵 Harmonia.io API',
    status: 'online',
    version: '1.0.0'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('');
  console.log('🎵 Harmonia.io rodando!');
  console.log(`📍 http://127.0.0.1:${PORT}`);
  console.log('');
});