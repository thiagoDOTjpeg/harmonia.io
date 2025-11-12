import { BadRequestError, OAuthMethod, ServiceProvider } from '@harmonia/shared';
import { NextFunction, Request, Response } from 'express';
import { Container } from '../../../../main/container';
import { LoginSchema, OAuthQuerySchema, RegisterSchema } from '../../schemas/auth';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { getOAuthCallbackHTML } from '../views/oauth-callback';

export class AuthController {
  static async googleConnect(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthMiddleware.getAuthenticatedUser(req, res);
      const { returnTo } = OAuthQuerySchema.parse(req.query);
      const useCase = Container.getStartOAuthUseCase();
      const { redirectTo } = await useCase.execute(OAuthMethod.connect, Container.getGoogleClient(), returnTo, user.id);
      res.redirect(redirectTo);
    } catch (error) {
      console.error('Google login error:', error);
      next(error)
    }
  }

  static async googleLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { returnTo } = OAuthQuerySchema.parse(req.query)
      const useCase = Container.getStartOAuthUseCase();
      const { redirectTo } = await useCase.execute(OAuthMethod.login, Container.getGoogleClient(), returnTo);
      res.redirect(redirectTo);
    } catch (error) {
      console.error('Google login error:', error);
      next(error)
    }
  }

  static async googleRegister(req: Request, res: Response, next: NextFunction) {
    try {
      const { returnTo } = OAuthQuerySchema.parse(req.query)
      const useCase = Container.getStartOAuthUseCase();
      const { redirectTo } = await useCase.execute(OAuthMethod.register, Container.getGoogleClient(), returnTo);
      res.redirect(redirectTo);
    } catch (error) {
      console.error('Google register error:', error);
      next(error)
    }
  }

  static async googleCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const code = String(req.query.code || '');
      const state = String(req.query.state || '');

      if (!code || !state) {
        return res.send(getOAuthCallbackHTML({
          success: false,
          error: 'Código ou estado inválido'
        }, undefined));
      }

      const useCase = Container.getHandleOAuthCallback();
      const result = await useCase.execute(ServiceProvider.GOOGLE, { code, state });

      return res.send(getOAuthCallbackHTML({
        success: true,
        token: result.token,
        user: { email: result.user.email || '', id: result.user.id, name: result.user.name || '' }
      }, result.returnTo));
    } catch (error) {
      console.error('Google callback error:', error);
      return res.send(getOAuthCallbackHTML({
        success: false,
        error: 'Falha na autenticação. Tente novamente.'
      }, 'http://localhost:3001'));
    }
  }

  static async spotifyConnect(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthMiddleware.getAuthenticatedUser(req, res);
      const { returnTo } = OAuthQuerySchema.parse(req.query)
      const useCase = Container.getStartOAuthUseCase();
      const { redirectTo } = await useCase.execute(OAuthMethod.connect, Container.getGoogleClient(), returnTo, user.id);
      res.redirect(redirectTo);
    } catch (error) {
      console.error('Spotify login error:', error);
      next(error)
    }
  }

  static async spotifyLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { returnTo } = OAuthQuerySchema.parse(req.query)
      const useCase = Container.getStartOAuthUseCase();
      const { redirectTo } = await useCase.execute(OAuthMethod.login, Container.getGoogleClient(), returnTo);
      res.redirect(redirectTo);
    } catch (error) {
      console.error('Spotify login error:', error);
      next(error)
    }
  }

  static async spotifyRegister(req: Request, res: Response, next: NextFunction) {
    try {
      const { returnTo } = OAuthQuerySchema.parse(req.query)
      const useCase = Container.getStartOAuthUseCase();
      const { redirectTo } = await useCase.execute(OAuthMethod.register, Container.getGoogleClient(), returnTo);
      res.redirect(redirectTo);
    } catch (error) {
      console.error('Spotify register error:', error);
      next(error)
    }
  }

  static async spotifyCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const code = String(req.query.code || '');
      const state = String(req.query.state || '');

      if (!code || !state) {
        return res.send(getOAuthCallbackHTML({
          success: false,
          error: 'Código ou estado inválido'
        }, undefined));
      }

      const useCase = Container.getHandleOAuthCallback();
      const result = await useCase.execute(ServiceProvider.SPOTIFY, { code, state });

      return res.send(getOAuthCallbackHTML({
        success: true,
        token: result.token,
        user: { email: result.user.email || '', id: result.user.id, name: result.user.name || '' }
      }, result.returnTo));
    } catch (error) {
      console.error('Spotify callback error:', error);
      return res.send(getOAuthCallbackHTML({
        success: false,
        error: 'Falha na autenticação. Tente novamente.'
      }, 'http://localhost:3001'));
    }
  }

  static async localRegister(req: Request, res: Response, next: NextFunction) {
    try {
      const bodyParsed = RegisterSchema.parse(req.body);

      if (!bodyParsed.email || !bodyParsed.password) {
        throw new BadRequestError("Todos os campos devem estar preenchidos")
      }

      const useCase = Container.getStartLocalRegister();
      const result = await useCase.execute(bodyParsed);

      if ('error' in result) {
        const status = result.error === 'email_in_use' ? 409 : 400;
        return res.status(status).json(result);
      }

      return res.status(201).json(result);
    } catch (error) {
      console.error('Local register error:', error);
      next(error)
    }
  }

  static async localLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const bodyParsed = LoginSchema.parse(req.body);

      if (!bodyParsed.email || !bodyParsed.password) {
        throw new BadRequestError("Todos os campos devem estar preenchidos")
      }

      const useCase = Container.getStartLocalLogin();
      const result = await useCase.execute(bodyParsed);

      if ('error' in result) {
        const status = result.error === 'invalid_credentials' ? 401 : 400;
        return res.status(status).json(result);
      }

      return res.json(result);
    } catch (error) {
      console.error('Local login error:', error);
      next(error);
    }
  }
}