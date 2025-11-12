import { AppError } from "./AppError";

export class TokenExchangeError extends AppError {
  constructor(message: string = "Erro ao trocar tokens OAuth") {
    super(message, 500)
  }
}