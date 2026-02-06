import { IAuthProvider } from "@/application/ports/auth/IAuthProvider";
import { GoogleAuthProvider } from "@/application/providers/GoogleAuthProvider";
import { SpotifyAuthProvider } from "@/application/providers/SpotifyAuthProvider";
import { EnsureValidConnectionsUseCase } from "@/application/use_cases/service-connection/EnsureValidConnectionsUseCase";
import { RevokeServiceConnectionUseCase } from "@/application/use_cases/service-connection/RevokeServiceConnectionUseCase";
import { AESSerializer } from "@/infrastructure/adapter/serializer/AESSerializer";
import { AESTokenEncrypter } from "@/infrastructure/crypto/AESTokenEncrypter";
import { PinoLoggerAdapter } from "@/infrastructure/logger";
import { SystemClock } from "@/infrastructure/time/SystemClock";
import { ServiceProvider } from "@harmonia/shared";
import { makePrismaIServiceConnectionRepository } from "./repositories.factory";

// Memoized instances
const logger = new PinoLoggerAdapter();
const encryptionKey = process.env.AES_SECRET || "";
const encryptor = new AESTokenEncrypter(encryptionKey);
const tokenSerializer = new AESSerializer();
const clock = new SystemClock();
const googleAuthProvider = new GoogleAuthProvider(logger);
const spotifyAuthProvider = new SpotifyAuthProvider(logger);

const providers: Record<ServiceProvider, IAuthProvider> = {
  [ServiceProvider.GOOGLE]: googleAuthProvider,
  [ServiceProvider.SPOTIFY]: spotifyAuthProvider
};

export const makeEnsureValidConnectionsUseCase = () => {
  return new EnsureValidConnectionsUseCase(
    makePrismaIServiceConnectionRepository(),
    encryptor,
    tokenSerializer,
    clock,
    providers
  );
}

export const makeRevokeServiceConnectionUseCase = () => {
  return new RevokeServiceConnectionUseCase(
    makePrismaIServiceConnectionRepository(),
    encryptor,
    tokenSerializer,
    googleAuthProvider,
    logger,
  );
}