import { User } from "@/domain/entities/User";

export class UserBuilder {
  private props: User = {
    id: 'default-user-id',
    email: 'default@example.com',
    name: 'Default User',
    passwordHash: 'hashed_password_safe',
    emailVerifiedAt: new Date(),
  };

  public withEmail(email: string): UserBuilder {
    this.props.email = email;
    return this;
  }

  public withPasswordHash(hash: string | null): UserBuilder {
    this.props.passwordHash = hash;
    return this;
  }

  public withoutPassword(): UserBuilder {
    this.props.passwordHash = null;
    return this;
  }

  public unverified(): UserBuilder {
    this.props.emailVerifiedAt = null;
    return this;
  }

  public build(): User {
    return new User(
      this.props.id,
      this.props.email,
      this.props.name,
      this.props.passwordHash,
      this.props.emailVerifiedAt
    );
  }
}