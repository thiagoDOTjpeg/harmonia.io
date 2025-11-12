import { AppError } from "./AppError";

export class UnathorizedError extends AppError {
  constructor(message: string = "Não Autorizado") {
    super(message, 401)
  }
}