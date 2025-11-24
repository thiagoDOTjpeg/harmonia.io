import { AppError, BadRequestError, InvalidCredentialsError, NotFoundError, PlaylistLimitExceededError, TokenExchangeError, UnathorizedError } from "@harmonia/shared";
import { NextFunction, Request, Response } from "express";

export class ErrorHandlerMiddleware {
  static globalErrorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (err instanceof NotFoundError) {
      return res.status(404).json({ message: err.message })
    } else if (err instanceof BadRequestError) {
      return res.status(400).json({ error: "bad_request", message: err.message })
    } else if (err instanceof InvalidCredentialsError) {
      return res.status(401).json({ error: "invalid_credentials", message: err.message })
    } else if (err instanceof TokenExchangeError) {
      return res.status(500).json({ error: "token_exchange", message: err.message })
    } else if (err instanceof UnathorizedError) {
      return res.status(401).json({ error: "unathorized", message: err.message })
    } else if (err instanceof PlaylistLimitExceededError) {
      return res.status(400).json({ error: "bad_request", message: err.message })

    } else if (err instanceof AppError) {
      return res.status(500).json({ error: "internal_error", message: err.message })
    }
    return res.status(500).json({ message: "Erro Interno de Servidor" })
  }
}