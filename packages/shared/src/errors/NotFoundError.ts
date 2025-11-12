import { AppError } from "./AppError";

export class NotFoundError extends AppError {
  constructor(message: string = "Recurso não encontrado") {
    super(message, 404);
  }
}