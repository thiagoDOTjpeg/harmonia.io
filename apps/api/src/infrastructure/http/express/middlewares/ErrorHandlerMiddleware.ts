import { logger } from "@/infrastructure/logger";
import { AppError, BadRequestError, InvalidCredentialsError, NotFoundError, PlaylistLimitExceededError, TokenExchangeError, UnathorizedError } from "@harmonia/shared";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export class ErrorHandlerMiddleware {
  static globalErrorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (err instanceof NotFoundError) {
      logger.warn({ err, path: req.path, method: req.method }, "Resource not found");
      return res.status(404).json({ message: err.message })
    } else if (err instanceof BadRequestError) {
      logger.warn({ err, path: req.path, method: req.method }, "Bad request");
      return res.status(400).json({ error: "bad_request", message: err.message })
    } else if (err instanceof InvalidCredentialsError) {
      logger.warn({ err, path: req.path, method: req.method }, "Invalid credentials");
      return res.status(401).json({ error: "invalid_credentials", message: err.message })
    } else if (err instanceof TokenExchangeError) {
      logger.error({ err, path: req.path, method: req.method }, "Token exchange failed");
      return res.status(500).json({ error: "token_exchange", message: err.message })
    } else if (err instanceof UnathorizedError) {
      logger.warn({ err, path: req.path, method: req.method }, "Unauthorized access");
      return res.status(401).json({ error: "unathorized", message: err.message })
    } else if (err instanceof PlaylistLimitExceededError) {
      logger.warn({ err, path: req.path, method: req.method }, "Playlist limit exceeded");
      return res.status(400).json({ error: "bad_request", message: err.message })
    } else if (err instanceof ZodError) {
      logger.warn({ err, path: req.path, method: req.method }, "Validation error");
      return res.status(400).json({ error: "bad_request", message: err.message })
    }
    else if (err instanceof AppError) {
      logger.error({ err, path: req.path, method: req.method }, "Application error");
      return res.status(500).json({ error: "internal_error", message: err.message })
    }
    logger.error({ err, path: req.path, method: req.method }, "CRITICAL: Unhandled Error");
    return res.status(500).json({ message: "Erro Interno de Servidor" })
  }
}