import express from 'express';
import google_oauth from '../services/google_oauth';
import spotify_oauth from '../services/spotify_oauth';
import user_auth from '../services/user_auth';

const router = express.Router();

router.post('/auth/register', user_auth.register);
router.post('/auth/login', user_auth.login);

router.get('/auth/google/login', google_oauth.startLogin);
router.get('/auth/google/register', google_oauth.startRegister);
router.get('/auth/google/callback', google_oauth.callback);

router.get('/auth/spotify/login', spotify_oauth.startLogin);
router.get('/auth/spotify/register', spotify_oauth.startRegister);
router.get('/auth/spotify/callback', spotify_oauth.callback);

export default router;