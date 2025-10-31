import express from 'express';
import { requireAuth } from '../lib/auth';

const router = express.Router();

router.get('/me', requireAuth, (_req, res) => {
  const user = res.locals.user;
  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    spotifyId: user.spotifyId,
  });
});

export default router;