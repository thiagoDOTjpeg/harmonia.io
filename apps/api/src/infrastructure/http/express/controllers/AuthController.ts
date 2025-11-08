import { User } from '@/domain/entities/User';
import { OAuthMethod, OAuthQueryDto } from '@harmonia/shared';
import { Request, Response } from 'express';
import { Container } from '../../../../main/container';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { getOAuthCallbackHTML } from '../views/oauth-callback';

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
      let userId: string | undefined;


      if (!code || !state) {
        return res.send(getOAuthCallbackHTML({
          success: false,
          error: 'Código ou estado inválido'
        }, undefined));
      }

      const stateManager = Container.getStateManager();
      const stateData = await stateManager.get(state);

      if (stateData?.method === OAuthMethod.connect) {
        const response = await AuthMiddleware.getAuthenticatedUser(req, res);
        if (response instanceof User) {
          userId = response.id
        }
      }
      const returnTo = stateData?.returnTo;
      const useCase = Container.getHandleGoogleCallback(userId);
      const result = await useCase.execute({ code, state });

      if ('error' in result) {
        const errorMessages: Record<string, string> = {
          no_account: 'Conta não encontrada. Por favor, cadastre-se primeiro.',
          email_in_use: 'Este email já está em uso com outro método de login.',
          require_manual_link: 'É necessário vincular sua conta manualmente.',
          email_ambiguous: 'Este email está associado a múltiplas contas.',
          conflict: 'Conflito ao processar sua autenticação.',
        };
        return res.send(getOAuthCallbackHTML({
          success: false,
          error: errorMessages[result.error] || 'Erro na autenticação'
        }, returnTo));
      }

      return res.send(getOAuthCallbackHTML({
        success: true,
        token: result.token,
        user: { email: result.user.email || '', id: result.user.id, name: result.user.name || '' }
      }, returnTo));
    } catch (error) {
      console.error('Google callback error:', error);
      return res.send(getOAuthCallbackHTML({
        success: false,
        error: 'Falha na autenticação. Tente novamente.'
      }, 'http://localhost:3001'));
    }
  }

  static async spotifyCallback(req: Request, res: Response) {
    try {
      const code = String(req.query.code || '');
      const state = String(req.query.state || '');
      let userId: string | undefined;

      if (!code || !state) {
        return res.send(getOAuthCallbackHTML({
          success: false,
          error: 'Código ou estado inválido'
        }, undefined));
      }

      const stateManager = Container.getStateManager();
      const stateData = await stateManager.get(state);
      if (stateData?.method === OAuthMethod.connect) {
        const response = await AuthMiddleware.getAuthenticatedUser(req, res);
        if (response instanceof User) {
          userId = response.id
        }
      }
      const returnTo = stateData?.returnTo;

      const useCase = Container.getHandleSpotifyCallback(userId);
      const result = await useCase.execute({ code, state });


      if ('error' in result) {
        const errorMessages: Record<string, string> = {
          no_account: 'Conta não encontrada. Por favor, cadastre-se primeiro.',
          email_in_use: 'Este email já está em uso com outro método de login.',
          require_manual_link: 'É necessário vincular sua conta manualmente.',
          email_ambiguous: 'Este email está associado a múltiplas contas.',
          conflict: 'Conflito ao processar sua autenticação.',
        };

        return res.send(getOAuthCallbackHTML({
          success: false,
          error: errorMessages[result.error] || 'Erro na autenticação'
        }, returnTo));
      }

      return res.send(getOAuthCallbackHTML({
        success: true,
        token: result.token,
        user: { email: result.user.email || '', id: result.user.id, name: result.user.name || '' }
      }, returnTo));
    } catch (error) {
      console.error('Spotify callback error:', error);
      return res.send(getOAuthCallbackHTML({
        success: false,
        error: 'Falha na autenticação. Tente novamente.'
      }, 'http://localhost:3001'));
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