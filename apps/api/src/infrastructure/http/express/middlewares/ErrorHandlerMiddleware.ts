import { NotFoundError } from "@harmonia/shared";
import { NextFunction, Request, Response } from "express";

export class ErrorHandlerMiddleware {
  public globalErrorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (err instanceof NotFoundError) {
      return res.status(400).json({ message: err.message })
    }
    return res.status(500).json({ message: "Erro Interno de Servidor" })
  }
}