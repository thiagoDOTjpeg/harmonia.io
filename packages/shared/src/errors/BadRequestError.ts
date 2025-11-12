import { AppError } from "./AppError";

export class BadRequestError extends AppError {
  constructor(message: string = "Solicitação inválida") {
    super(message, 400)
  }
}