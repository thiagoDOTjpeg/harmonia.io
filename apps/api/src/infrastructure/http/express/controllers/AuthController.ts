import { AppError, BadRequestError, InvalidCredentialsError, OAuthMethod, RequestResetPasswordInput, ResetPasswordInput, ServiceProvider } from '@harmonia/shared';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Container } from '../../../../main/container';
import { LoginSchema, OAuthQuerySchema, RegisterSchema } from '../../schemas/auth';
import { getOAuthCallbackHTML } from '../views/oauth-callback';


export class AuthController {
  static async googleConnect(req: Request, res: Response, next: NextFunction) {
    try {
      const { returnTo } = OAuthQuerySchema.parse(req.query);
      const stateParam = req.query.state;
      if (!stateParam) {
        throw new InvalidCredentialsError("State é necessário para fazer a conexão")
      }
      const stateData = JSON.parse(Buffer.from(stateParam as string, "base64").toString());

      if (Date.now() - stateData.timestamp > 5 * 60 * 1000) {
        throw new AppError("State expirado.");
      }

      const decoded = jwt.verify(stateData.token, process.env.JWT_SECRET || "") as jwt.JwtPayload
      const userId = decoded.sub;

      const useCase = Container.getStartOAuthUseCase();
      const { redirectTo } = await useCase.execute(OAuthMethod.connect, Container.getGoogleClient(), returnTo, userId);
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
        user: { email: result.user.email || '', id: result.user.id, name: result.user.name || '' },
        method: result.method
      },
        result.returnTo));
    } catch (error) {
      console.error('Google callback error:', error);
      if (error instanceof AppError) {
        return res.send(getOAuthCallbackHTML({
          success: false,
          error: error.message
        }, 'http://127.0.0.1:3001'));
      }
      return res.send(getOAuthCallbackHTML({
        success: false,
        error: 'Falha na autenticação. Tente novamente.'
      }, 'http://127.0.0.1:3001'));
    }
  }

  static async spotifyConnect(req: Request, res: Response, next: NextFunction) {
    try {
      const { returnTo } = OAuthQuerySchema.parse(req.query)

      const stateParam = req.query.state;
      if (!stateParam) {
        throw new InvalidCredentialsError("State é necessário para fazer a conexão")
      }
      const stateData = JSON.parse(Buffer.from(stateParam as string, "base64").toString());

      if (Date.now() - stateData.timestamp > 5 * 60 * 1000) {
        throw new AppError("State expirado.");
      }

      const decoded = jwt.verify(stateData.token, process.env.JWT_SECRET || "") as jwt.JwtPayload
      const userId = decoded.sub;

      const useCase = Container.getStartOAuthUseCase();
      const { redirectTo } = await useCase.execute(OAuthMethod.connect, Container.getSpotifyClient(), returnTo, userId);
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
      const { redirectTo } = await useCase.execute(OAuthMethod.login, Container.getSpotifyClient(), returnTo);
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
      const { redirectTo } = await useCase.execute(OAuthMethod.register, Container.getSpotifyClient(), returnTo);
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
        user: { email: result.user.email || '', id: result.user.id, name: result.user.name || '' },
        method: result.method
      }, result.returnTo));
    } catch (error) {
      console.error('Spotify callback error:', error);
      if (error instanceof AppError) {
        return res.send(getOAuthCallbackHTML({
          success: false,
          error: error.message
        }, 'http://127.0.0.1:3001'));
      }
      return res.send(getOAuthCallbackHTML({
        success: false,
        error: 'Falha na autenticação. Tente novamente.'
      }, 'http://127.0.0.1:3001'));
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

  static async requestReset(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as RequestResetPasswordInput;
      if (!body) throw new BadRequestError("Todos os campos devem estar preenchidos")

      const useCase = Container.getRequestPasswordResetUseCase();
      await useCase.execute({ email: body.email });
      return res.status(204).send();
    } catch (error) {
      console.error("Ocorreu um erro ao fazer o request de reset de senha", error)
      return res.status(204).send();
    }
  }

  static async resetPassowrd(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as ResetPasswordInput
      if (!body) throw new BadRequestError("Todos os campos devem estar preenchidos")

      const useCase = Container.getResetPasswordUseCase();
      await useCase.execute({ code: body.code, email: body.email, newPassword: body.newPassword })
      return res.status(204).send();
    } catch (error) {
      console.error("Ocorreu um erro ao fazer o reset da senha", error)
      return res.status(204).send();
    }
  }
}