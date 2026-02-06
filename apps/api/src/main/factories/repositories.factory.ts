import { prisma } from "@/infrastructure/db/prisma/client";
import { PrismaPlaylistRepository } from "@/infrastructure/db/prisma/repositories/PrismaPlaylistRepository";
import { PrismaServiceConnectionRepository } from "@/infrastructure/db/prisma/repositories/PrismaServiceConnectionRepository";
import { PrismaUserRepository } from "@/infrastructure/db/prisma/repositories/PrismaUserRepository";

const prismaUserRepository = new PrismaUserRepository(prisma)
const prismaServiceConnectionRepository = new PrismaServiceConnectionRepository(prisma);
const prismaPlaylistRepository = new PrismaPlaylistRepository(prisma);

export const makePrismaIUserRsepository = () => {
  return prismaUserRepository;
}

export const makePrismaIServiceConnectionRepository = () => {
  return prismaServiceConnectionRepository;
}

export const makePrismaIPlaylistRepository = () => {
  return prismaPlaylistRepository;
}