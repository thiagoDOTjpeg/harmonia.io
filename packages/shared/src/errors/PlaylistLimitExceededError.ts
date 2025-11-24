import { AppError } from "./AppError";

export class PlaylistLimitExceededError extends AppError {
  constructor(message: string = "Limite de músicas da playlist execido") {
    super(message, 400);
  }
}