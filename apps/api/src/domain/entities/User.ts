export class User {
  constructor(
    public readonly id: string,
    public email: string,
    public name: string,
    public passwordHash: string | null = null,
    public emailVerifiedAt: Date | null,
  ) { }
}