import { OAuthQueryDto } from '@harmonia/shared';
import { Request, Response } from 'express';
import { Container } from '../../../../main/container';

export class AuthController {
  static async googleLogin(req: Request, res: Response) {
    try {
      const { returnTo } = req.query as OAuthQueryDto;
      const useCase = Container.getStartGoogleLogin();
      const { redirectTo } = await useCase.execute(returnTo);
      res.redirect(redirectTo);
    } catch (error) {
      console.error('Google login error:', error);
      res.status(500).json({ error: 'internal_error' });
    }
  }

  static async googleRegister(req: Request, res: Response) {
    try {
      const { returnTo } = req.query as OAuthQueryDto;
      const useCase = Container.getStartGoogleRegister();
      const { redirectTo } = await useCase.execute(returnTo);
      res.redirect(redirectTo);
    } catch (error) {
      console.error('Google register error:', error);
      res.status(500).json({ error: 'internal_error' });
    }
  }

  static async googleCallback(req: Request, res: Response) {
    try {
      const code = String(req.query.code || '');
      const state = String(req.query.state || '');

      if (!code || !state) {
        return res.status(400).json({ error: 'invalid_state_or_code' });
      }

      const useCase = Container.getHandleGoogleCallback();
      const result = await useCase.execute({ code, state });

      if ('error' in result) {
        const status =
          result.error === 'no_account' ? 404 :
            ['email_in_use', 'require_manual_link', 'email_ambiguous', 'conflict'].includes(result.error)
              ? 409
              : 400;
        return res.status(status).json(result);
      }

      return res.json(result);
    } catch (error) {
      console.error('Google callback error:', error);
      return res.status(500).json({ error: 'auth_failed' });
    }
  }

  static async spotifyLogin(req: Request, res: Response) {
    try {
      const { returnTo } = req.query as OAuthQueryDto;
      const useCase = Container.getStartSpotifyLogin();
      const { redirectTo } = await useCase.execute(returnTo);
      res.redirect(redirectTo);
    } catch (error) {
      console.error('Spotify login error:', error);
      res.status(500).json({ error: 'internal_error' });
    }
  }

  static async spotifyRegister(req: Request, res: Response) {
    try {
      const { returnTo } = req.query as OAuthQueryDto;
      const useCase = Container.getStartSpotifyRegister();
      const { redirectTo } = await useCase.execute(returnTo);
      res.redirect(redirectTo);
    } catch (error) {
      console.error('Spotify register error:', error);
      res.status(500).json({ error: 'internal_error' });
    }
  }

  static async spotifyCallback(req: Request, res: Response) {
    try {
      const code = String(req.query.code || '');
      const state = String(req.query.state || '');

      if (!code || !state) {
        return res.status(400).json({ error: 'invalid_state_or_code' });
      }

      const useCase = Container.getHandleSpotifyCallback();
      const result = await useCase.execute({ code, state });

      if ('error' in result) {
        const status =
          result.error === 'no_account' ? 404 :
            ['email_in_use', 'require_manual_link', 'email_ambiguous', 'conflict'].includes(result.error)
              ? 409
              : 400;
        return res.status(status).json(result);
      }

      return res.json(result);
    } catch (error) {
      console.error('Spotify callback error:', error);
      return res.status(500).json({ error: 'auth_failed' });
    }
  }

  static async localRegister(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'missing_email_or_password' });
      }

      const useCase = Container.getStartLocalRegister();
      const result = await useCase.execute({ email, password, name });

      if ('error' in result) {
        const status = result.error === 'email_in_use' ? 409 : 400;
        return res.status(status).json(result);
      }

      return res.status(201).json(result);
    } catch (error) {
      console.error('Local register error:', error);
      return res.status(500).json({ error: 'register_failed' });
    }
  }

  static async localLogin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'missing_email_or_password' });
      }

      const useCase = Container.getStartLocalLogin();
      const result = await useCase.execute({ email, password });

      if ('error' in result) {
        const status = result.error === 'invalid_credentials' ? 401 : 400;
        return res.status(status).json(result);
      }

      return res.json(result);
    } catch (error) {
      console.error('Local login error:', error);
      return res.status(500).json({ error: 'login_failed' });
    }
  }
}