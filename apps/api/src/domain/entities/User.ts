import { IHasher } from "@/application/ports/crypto/IHasher";
import { UserProps } from "@/types/entity/user";
import { AppError } from "@harmonia/shared";
import { v4 } from "uuid";
import { Email } from "../value-objects/Email";

export class User {
  private constructor(
    private readonly _id: string,
    private _email: Email,
    private _name: string,
    private _passwordHash: string | null = null,
    private _emailVerifiedAt: Date | null,
  ) { }

  get id(): string { return this._id; }
  get email(): string { return this._email.getValue(); }
  get name(): string { return this._name; }
  get isVerified(): boolean { return this._emailVerifiedAt !== null; }

  static create(props: { name: string, email: string, passwordHash: string }): User {
    return new User(
      v4(),
      Email.create(props.email),
      props.name,
      props.passwordHash,
      null
    );
  }

  /**
   * Método exclusivo para Camada de Persistência/Mappers.
   * Quebra o encapsulamento de forma controlada apenas para I/O.
   */
  public toPersistence(): UserProps {
    return {
      id: this._id,
      email: this._email.getValue(),
      name: this._name,
      passwordHash: this._passwordHash,
      emailVerifiedAt: this._emailVerifiedAt,
    };
  }

  static reconstitute(props: {
    id: string;
    email: string;
    name: string;
    passwordHash: string | null;
    emailVerifiedAt: Date | null;
  }): User {
    return new User(
      props.id,
      Email.create(props.email),
      props.name,
      props.passwordHash,
      props.emailVerifiedAt
    );
  }

  hasPassword(): boolean {
    return this._passwordHash !== null;
  }

  verifyEmail(): void {
    if (this._emailVerifiedAt) {
      throw new AppError("Email já verificado");
    }
    this._emailVerifiedAt = new Date();
  }

  async verifyPassword(plainPassword: string, hasher: IHasher): Promise<boolean> {
    if (!this._passwordHash) return false;
    return await hasher.verify(plainPassword, this._passwordHash);

  }

  changeEmail(newEmail: string): void {
    this._email = Email.create(newEmail);
    this._emailVerifiedAt = null;
  }

  changePassword(passwordHash: string): void {
    this._passwordHash = passwordHash;
  }
}