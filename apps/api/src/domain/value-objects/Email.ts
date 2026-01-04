import { AppError } from '@harmonia/shared'; 

export class Email {
  private readonly value: string;

  private constructor(email: string) {
    this.value = email;
  }


  static create(email: string): Email {
    if (!email) {
      throw new AppError('Email é obrigatório');
    }
    const normalized = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalized)) {
      throw new AppError(`Email inválido: ${email}`);
    }

    return new Email(normalized);
  }

  getValue(): string {
    return this.value;
  }

  toString(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}