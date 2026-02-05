import { IAuthProvider } from "@/application/ports/auth/IAuthProvider";
import { GoogleAuthProvider } from "@/application/providers/GoogleAuthProvider";
import { SpotifyAuthProvider } from "@/application/providers/SpotifyAuthProvider";
import { EnsureValidConnectionsUseCase } from "@/application/use_cases/service-connection/EnsureValidConnectionsUseCase";
import { RevokeServiceConnectionUseCase } from "@/application/use_cases/service-connection/RevokeServiceConnectionUseCase";
import { AESSerializer } from "@/infrastructure/adapter/serializer/AESSerializer";
import { AESTokenEncrypter } from "@/infrastructure/crypto/AESTokenEncrypter";
import { prisma } from "@/infrastructure/db/prisma/client";
import { PrismaServiceConnectionRepository } from "@/infrastructure/db/prisma/repositories/PrismaServiceConnectionRepository";
import { PinoLoggerAdapter } from "@/infrastructure/logger";
import { SystemClock } from "@/infrastructure/time/SystemClock";
import { ServiceProvider } from "@harmonia/shared";


const makeILogger = () => {
  return new PinoLoggerAdapter();
}

const makeIServiceConnectionRepository = () => {
  return new PrismaServiceConnectionRepository(prisma);
}

const makeIEncryptor = () => {
  const encryptionKey = process.env.AES_SECRET || "";
  return new AESTokenEncrypter(encryptionKey);
}

const makeITokenSerializer = () => {
  return new AESSerializer();
}

const makeIClock = () => {
  return new SystemClock();
}

const makeIAuthGoogleProvider = () => {
  return new GoogleAuthProvider(makeILogger());
}


export const makeEnsureValidConnectionsUseCase = () => {
  const providers: Record<ServiceProvider, IAuthProvider> = {
    [ServiceProvider.GOOGLE]: new GoogleAuthProvider(makeILogger()),
    [ServiceProvider.SPOTIFY]: new SpotifyAuthProvider(makeILogger())
  }
  return new EnsureValidConnectionsUseCase(
    makeIServiceConnectionRepository(),
    makeIEncryptor(),
    makeITokenSerializer(),
    makeIClock(),
    providers
  );
}

export const makeRevokeServiceConnectionUseCase = () => {
  return new RevokeServiceConnectionUseCase(
    makeIServiceConnectionRepository(),
    makeIEncryptor(),
    makeITokenSerializer(),
    makeIAuthGoogleProvider(),
    makeILogger(),
  );
}