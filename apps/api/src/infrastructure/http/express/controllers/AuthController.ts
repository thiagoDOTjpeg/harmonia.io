import { OAuthParamCallbackSchema, OAuthParamSchema } from '@/schemas/oauth';
import { AppError, BadRequestError, LoginSchema, OAuthMethod, OAuthQuerySchema, RegisterSchema, RequestResetPasswordDTO, ResetPasswordDTO, SetPasswordDTO, UnathorizedError } from '@harmonia/shared';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Container } from '../../../../main/container';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { getOAuthCallbackHTML } from '../views/oauth-callback';


export class AuthController {
  static async startOAuthFlow(req: Request, res: Response, next: NextFunction) {
    try {
      const { provider } = OAuthParamSchema.parse(req.params)
      const { intent, returnTo, state } = OAuthQuerySchema.parse(req.query)
      let userId: string | undefined
      if (intent === OAuthMethod.connect) {
        if (!state) throw new BadRequestError("State é necessário para fazer a conexão");

        const stateData = JSON.parse(Buffer.from(state as string, "base64").toString());

        if (Date.now() - stateData.timestamp > 5 * 60 * 1000) {
          throw new AppError("State expirado.");
        }

        const decoded = jwt.verify(stateData.token, process.env.JWT_SECRET || "") as jwt.JwtPayload
        userId = decoded.sub;
      }
      const client = Container.getOAuthClient(provider)
      if (!client) throw new AppError("Serviço não suportado")
      const useCase = Container.getStartOAuthUseCase();
      const { redirectTo } = await useCase.execute(intent, client, returnTo, userId)
      res.redirect(redirectTo)
    } catch (error) {
      console.error("Ocorreu um erro ao fazer o login OAuth", error);
      next(error);
    }
  }

  static async handleOAuthCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, state } = OAuthParamCallbackSchema.parse(req.query);
      const { provider } = OAuthParamSchema.parse(req.params)

      const useCase = Container.getHandleOAuthCallback();
      const result = await useCase.execute(provider, { code, state });

      return res.send(getOAuthCallbackHTML({
        success: true,
        ...(result.method === OAuthMethod.register ? { isPasswordSetupRequired: true } : {}),
        token: result.token,
        user: { email: result.user.email || '', id: result.user.id, name: result.user.name || '' },
        method: result.method
      }, result.returnTo));
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
      const body = req.body as RequestResetPasswordDTO;
      if (!body) throw new BadRequestError("Todos os campos devem estar preenchidos")

      const useCase = Container.getRequestPasswordResetUseCase();
      await useCase.execute({ email: body.email });
      return res.status(204).send();
    } catch (error) {
      console.error("Ocorreu um erro ao fazer o request de reset de senha", error)
      next(error);
    }

  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as ResetPasswordDTO
      if (!body) throw new BadRequestError("Todos os campos devem estar preenchidos")

      const useCase = Container.getResetPasswordUseCase();
      await useCase.execute({ code: body.code, email: body.email, newPassword: body.newPassword })
      return res.status(204).send();
    } catch (error) {
      console.error("Ocorreu um erro ao fazer o reset da senha", error)
      next(error);
    }
  }

  static async setPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthMiddleware.getAuthenticatedUser(req, res);
      if (!user) throw new UnathorizedError("Usuário não autenticado");
      const body = req.body as SetPasswordDTO
      if (!body) throw new BadRequestError("Todos os campos devem estar preenchidos")

      const useCase = Container.getSetPasswordUseCase();
      await useCase.execute(user, body);
      res.status(204).send()
    } catch (error) {
      console.error("Ocorreu um erro ao setar a senha do usuário", error);
      next(error);
    }
  }
}