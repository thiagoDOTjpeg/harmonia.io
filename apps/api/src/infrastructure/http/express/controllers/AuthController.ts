import { logger } from '@/infrastructure/logger';
import { OAuthParamCallbackSchema, OAuthParamSchema } from '@/schemas/oauth';
import {
  AppError,
  BadRequestError,
  LoginSchema,
  OAuthMethod,
  OAuthQuerySchema,
  RegisterSchema,
  RequestAccessSchema,
  RequestResetPasswordDTO,
  ResetPasswordDTO,
  SetPasswordDTO,
  UnathorizedError,
} from '@harmonia/shared';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Container } from '../../../../main/container';
import { getOAuthCallbackHTML } from '../../../../presentation/views/oauth-callback';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import {
  ACCESS_TOKEN_COOKIE,
  clearAuthCookies,
  parseCookies,
  REFRESH_TOKEN_COOKIE,
  setAuthCookies,
} from '../utils/cookies';

export class AuthController {
  private static issueAndSetCookies(res: Response, userId: string, existingAccessToken?: string) {
    const tokenManager = Container.getTokenManager();
    const accessToken = existingAccessToken || tokenManager.sign({ sub: userId }, '15m');
    const refreshToken = tokenManager.sign({ sub: userId, type: 'refresh' }, '7d');
    setAuthCookies(res, accessToken, refreshToken);
    return { accessToken, refreshToken };
  }

  static async requestAccess(req: Request, res: Response, next: NextFunction) {
    try {
      const data = RequestAccessSchema.parse(req.body);
      const provider = Container.getEmailProvider();
      await provider.sendRequestAccessEmail(data);
      res.status(200).send();
    } catch (error) {
      logger.error({ err: error }, 'Error requesting access email');
      next(error);
    }
  }

  static async startOAuthFlow(req: Request, res: Response, next: NextFunction) {
    try {
      const { provider } = OAuthParamSchema.parse(req.params);
      const { intent, returnTo, state } = OAuthQuerySchema.parse(req.query);
      let userId: string | undefined;

      if (intent === OAuthMethod.connect) {
        const cookies = parseCookies(req.headers.cookie);
        const cookieToken = cookies[ACCESS_TOKEN_COOKIE] || cookies[REFRESH_TOKEN_COOKIE];

        if (cookieToken) {
          const decoded = jwt.verify(
            cookieToken,
            process.env.JWT_SECRET || 'dev-secret',
          ) as jwt.JwtPayload;
          userId = decoded.sub;
        } else if (state) {
          const stateData = JSON.parse(
            Buffer.from(state as string, 'base64').toString(),
          );

          if (Date.now() - stateData.timestamp > 5 * 60 * 1000) {
            throw new AppError('State expirado.');
          }

          const decoded = jwt.verify(
            stateData.token,
            process.env.JWT_SECRET || 'dev-secret',
          ) as jwt.JwtPayload;
          userId = decoded.sub;
        } else {
          throw new UnathorizedError('Autenticação necessária para conectar serviço');
        }
      }

      const useCase = Container.getStartOAuthUseCase();
      const { redirectTo } = await useCase.execute(intent, provider, returnTo, userId);
      res.redirect(redirectTo);
    } catch (error) {
      logger.error({ err: error, provider: req.params.provider }, 'Error starting OAuth flow');
      next(error);
    }
  }

  static async handleOAuthCallback(req: Request, res: Response, _next: NextFunction) {
    try {
      const { code, state } = OAuthParamCallbackSchema.parse(req.query);
      const { provider } = OAuthParamSchema.parse(req.params);

      const useCase = Container.getHandleOAuthCallback();
      const result = await useCase.execute(provider, { code, state });

      AuthController.issueAndSetCookies(res, result.user.id, result.token);

      return res.send(
        getOAuthCallbackHTML(
          {
            success: true,
            ...(result.method === OAuthMethod.register
              ? { isPasswordSetupRequired: result.isPasswordSetupRequired }
              : {}),
            token: result.token,
            user: {
              email: result.user.email || '',
              id: result.user.id,
              name: result.user.name || '',
            },
            method: result.method,
          },
          result.returnTo,
        ),
      );
    } catch (error) {
      logger.error({ err: error, provider: req.params.provider }, 'OAuth callback error');
      if (error instanceof AppError) {
        return res.send(
          getOAuthCallbackHTML(
            {
              success: false,
              error: error.message,
            },
            'http://127.0.0.1:3001',
          ),
        );
      }
      return res.send(
        getOAuthCallbackHTML(
          {
            success: false,
            error: 'Falha na autenticação. Tente novamente.',
          },
          'http://127.0.0.1:3001',
        ),
      );
    }
  }

  static async localRegister(req: Request, res: Response, next: NextFunction) {
    try {
      const bodyParsed = RegisterSchema.parse(req.body);

      if (!bodyParsed.email || !bodyParsed.password) {
        throw new BadRequestError('Todos os campos devem estar preenchidos');
      }

      const useCase = Container.getStartLocalRegister();
      const result = await useCase.execute(bodyParsed);

      if ('error' in result) {
        const status = result.error === 'email_in_use' ? 409 : 400;
        return res.status(status).json(result);
      }

      AuthController.issueAndSetCookies(res, result.user.id, result.token);

      return res.status(201).json({
        user: result.user,
        isPasswordSetupRequired: result.isPasswordSetupRequired,
      });
    } catch (error) {
      logger.error({ err: error }, 'Local register error');
      next(error);
    }
  }

  static async localLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const bodyParsed = LoginSchema.parse(req.body);

      if (!bodyParsed.email || !bodyParsed.password) {
        throw new BadRequestError('Todos os campos devem estar preenchidos');
      }

      const useCase = Container.getStartLocalLogin();
      const result = await useCase.execute(bodyParsed);

      if ('error' in result) {
        const status = result.error === 'invalid_credentials' ? 401 : 400;
        return res.status(status).json(result);
      }

      AuthController.issueAndSetCookies(res, result.user.id, result.token);

      return res.json({
        user: result.user,
        isPasswordSetupRequired: result.isPasswordSetupRequired,
      });
    } catch (error) {
      logger.error({ err: error }, 'Local login error');
      next(error);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const cookies = parseCookies(req.headers.cookie);
      const refreshToken = cookies[REFRESH_TOKEN_COOKIE] || req.body?.refreshToken;

      if (!refreshToken) {
        clearAuthCookies(res);
        throw new UnathorizedError('Refresh token não fornecido');
      }

      const tokenManager = Container.getTokenManager();
      let userId: string;

      try {
        const decoded = tokenManager.decode(refreshToken);
        userId = decoded.token.sub;
      } catch {
        clearAuthCookies(res);
        throw new UnathorizedError('Refresh token inválido ou expirado');
      }

      const userRepository = Container.getUserRepository();
      const user = await userRepository.findByUserId(userId);

      if (!user) {
        clearAuthCookies(res);
        throw new UnathorizedError('Usuário não encontrado');
      }

      AuthController.issueAndSetCookies(res, user.id);

      return res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        isPasswordSetupRequired: !user.hasPassword(),
      });
    } catch (error) {
      if (!(error instanceof UnathorizedError)) {
        logger.error({ err: error }, 'Refresh token error');
      }
      next(error);
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthMiddleware.getAuthenticatedUser(req, res);
      return res.status(200).json({
        id: user.id,
        email: user.email,
        name: user.name,
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(_req: Request, res: Response, next: NextFunction) {
    try {
      clearAuthCookies(res);
      return res.status(204).send();
    } catch (error) {
      logger.error({ err: error }, 'Logout error');
      next(error);
    }
  }

  static async requestReset(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as RequestResetPasswordDTO;
      if (!body) throw new BadRequestError('Todos os campos devem estar preenchidos');

      const useCase = Container.getRequestPasswordResetUseCase();
      await useCase.execute({ email: body.email });
      return res.status(204).send();
    } catch (error) {
      logger.error({ err: error }, 'Error requesting password reset');
      next(error);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as ResetPasswordDTO;
      if (!body) throw new BadRequestError('Todos os campos devem estar preenchidos');

      const useCase = Container.getResetPasswordUseCase();
      await useCase.execute({
        code: body.code,
        email: body.email,
        newPassword: body.newPassword,
      });
      return res.status(204).send();
    } catch (error) {
      logger.error({ err: error }, 'Error resetting password');
      next(error);
    }
  }

  static async setPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthMiddleware.getAuthenticatedUser(req, res);
      if (!user) throw new UnathorizedError('Usuário não autenticado');
      const body = req.body as SetPasswordDTO;
      if (!body) throw new BadRequestError('Todos os campos devem estar preenchidos');

      const useCase = Container.getSetPasswordUseCase();
      await useCase.execute(user, body);
      res.status(204).send();
    } catch (error) {
      logger.error({ err: error }, 'Error setting password');
      next(error);
    }
  }
}
