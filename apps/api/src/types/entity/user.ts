export interface UserProps {
  id: string;
  email: string;
  name: string;
  passwordHash: string | null;
  emailVerifiedAt: Date | null;
}