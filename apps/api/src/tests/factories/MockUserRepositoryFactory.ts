import { IUserRepository } from "@/application/repositories/IUserRepository";

export const createMockUserRepository: jest.Mocked<IUserRepository> = {
  createFromLocal: jest.fn(),
  findByEmail: jest.fn(),
  findByUserId: jest.fn(),
  getUserSummary: jest.fn(),
  update: jest.fn()
}