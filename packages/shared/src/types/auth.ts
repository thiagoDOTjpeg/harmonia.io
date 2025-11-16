export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name?: string;
}

export type ResetState = {
  randomCode: number,
}

export type SetPasswordInput = {
  newPassword: string
}

export type RequestResetPasswordInput = {
  email: string
}

export type ResetPasswordInput = {
  email: string
  code: number
  newPassword: string
}
