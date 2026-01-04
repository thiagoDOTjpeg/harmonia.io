import { IHasher } from "@/application/ports/crypto/IHasher";
import { AppError } from "@harmonia/shared";
import { Email } from "../value-objects/Email";

export class User {
  private constructor(
    private readonly _id: string,
    private _email: Email,
    private _name: string,
    private _passwordHash: string | null = null,
    private _emailVerifiedAt: Date | null,
  ) { }

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

  get id(): string { return this._id; }
  get email(): string { return this._email.getValue(); }
  get name(): string { return this._name; }
  get isVerified(): boolean { return this._emailVerifiedAt !== null; }

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

  hasPassword(): boolean {
    return this._passwordHash !== null;
  }

}