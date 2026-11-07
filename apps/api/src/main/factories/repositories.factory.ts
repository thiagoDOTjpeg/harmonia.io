import { prisma } from "@/infrastructure/db/prisma/client";
import { PrismaPlaylistRepository } from "@/infrastructure/db/prisma/repositories/PrismaPlaylistRepository";
import { PrismaPlaylistTrackRepository } from "@/infrastructure/db/prisma/repositories/PrismaPlaylistTrackRepository";
import { PrismaServiceConnectionRepository } from "@/infrastructure/db/prisma/repositories/PrismaServiceConnectionRepository";
import { PrismaTrackRepository } from "@/infrastructure/db/prisma/repositories/PrismaTrackRepository";
import { PrismaUserRepository } from "@/infrastructure/db/prisma/repositories/PrismaUserRepository";

const prismaUserRepository = new PrismaUserRepository(prisma)
const prismaServiceConnectionRepository = new PrismaServiceConnectionRepository(prisma);
const prismaPlaylistRepository = new PrismaPlaylistRepository(prisma);
const prismaTrackRepository = new PrismaTrackRepository(prisma);
const prismaPlaylistTrackRepository = new PrismaPlaylistTrackRepository(prisma);

export const makePrismaIUserRsepository = () => {
  return prismaUserRepository;
}

export const makePrismaIServiceConnectionRepository = () => {
  return prismaServiceConnectionRepository;
}

export const makePrismaIPlaylistRepository = () => {
  return prismaPlaylistRepository;
}

export const makePrismaITrackRepository = () => {
  return prismaTrackRepository;
}

export const makePrismaIPlaylistTrackRepository = () => {
  return prismaPlaylistTrackRepository;
}