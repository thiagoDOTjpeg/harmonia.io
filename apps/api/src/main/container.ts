import { PrismaPlaylistRepository } from '../infrastructure/db/prisma/repositories/PrismaPlaylistRepository';
import { PrismaPlaylistTrackRepository } from '../infrastructure/db/prisma/repositories/PrismaPlaylistTrackRepository';
import { PrismaTrackRepository } from '../infrastructure/db/prisma/repositories/PrismaTrackRepository';
import { PrismaUserRepository } from '../infrastructure/db/prisma/repositories/PrismaUserRepository';

import { GoogleOAuthClient } from '../infrastructure/client/GoogleOAuthClient';

import { BcryptPasswordHasher } from '../infrastructure/crypto/BcryptPasswordHasher';
import { JwtTokenManager } from '../infrastructure/crypto/JwtTokenManager';
import { SystemClock } from '../infrastructure/time/SystemClock';

// Use cases Auth
import { IAuthProvider } from '@/application/ports/auth/IAuthProvider';
import { IAuthUrlProvider } from '@/application/ports/oauth/IAuthUrlProvider';
import { IOAuthCallbackStrategy } from '@/application/ports/strategy/IOAuthCallbackStrategy';
import { EmailProvider } from '@/application/providers/EmailProvider';
import { GoogleAuthProvider } from '@/application/providers/GoogleAuthProvider';
import { SpotifyAuthProvider } from '@/application/providers/SpotifyAuthProvider';
import { SyncMusicService } from '@/application/services/SyncMusicService';
import { HandleOAuthCallback } from '@/application/use_cases/auth/HandleOAuthCallback';
import { RequestPasswordResetUseCase } from '@/application/use_cases/auth/RequestPasswordResetUseCase';
import { ResetPasswordUseCase } from '@/application/use_cases/auth/ResetPasswordUseCase';
import { SetPasswordUseCase } from '@/application/use_cases/auth/SetPasswordUseCase';
import { StartOAuthUseCase } from '@/application/use_cases/auth/StartOAuthUseCase';
import { EnsureValidConnectionsUseCase } from '@/application/use_cases/service-connection/EnsureValidConnectionsUseCase';
import { RevokeServiceConnectionUseCase } from '@/application/use_cases/service-connection/RevokeServiceConnectionUseCase';
import { OAuthCallbackStrategyFactory } from '@/infrastructure/adapter/oauth/factory/OAuthCallbackStrategyFactory';
import { OAuthUrlFactory } from '@/infrastructure/adapter/oauth/factory/OAuthUrlFactory';
import { GoogleOAuthCallbackStrategy } from '@/infrastructure/adapter/oauth/strategy/GoogleOAuthCallbackStrategy';
import { SpotifyOAuthCallbackStrategy } from '@/infrastructure/adapter/oauth/strategy/SpotifyOAuthCallbackStrategy';
import { AESSerializer } from '@/infrastructure/adapter/serializer/AESSerializer';
import { GoogleMusicClient } from '@/infrastructure/client/GoogleMusicClient';
import { AESTokenEncrypter } from '@/infrastructure/crypto/AESTokenEncrypter';
import { prisma } from '@/infrastructure/db/prisma/client';
import { PrismaServiceConnectionRepository } from '@/infrastructure/db/prisma/repositories/PrismaServiceConnectionRepository';
import { PlaylistSyncQueue } from '@/infrastructure/queue/PlaylistSyncQueue';
import { ResetState } from '@/types/auth';
import { OAuthState } from '@/types/oauth/state';
import { ServiceProvider } from '@harmonia/shared';
import { StartLocalLogin } from '../application/use_cases/auth/StartLocalLogin';
import { StartLocalRegister } from '../application/use_cases/auth/StartLocalRegister';
import { SpotifyOAuthClient } from '../infrastructure/client/SpotifyOAuthClient';
import { RedisStateStore } from '../infrastructure/state/RedisStateStore';

const ENCRYPTION_KEY: string = process.env.AES_SECRET || "";

export class Container {

  // Infra
  private static googleClient = new GoogleOAuthClient();
  private static spotifyClient = new SpotifyOAuthClient();
  private static googleMusicClient = new GoogleMusicClient();
  private static syncQueue: PlaylistSyncQueue;

  // Repositories
  private static userRepository = new PrismaUserRepository(prisma);
  private static playlistRepository = new PrismaPlaylistRepository(prisma);
  private static trackRepository = new PrismaTrackRepository(prisma);
  private static playlistTrackRepository = new PrismaPlaylistTrackRepository(prisma);
  private static serviceConnectionRepository = new PrismaServiceConnectionRepository(prisma);

  // Crypto & Time & Serializer
  private static tokenManager = new JwtTokenManager();
  private static passwordHasher = new BcryptPasswordHasher();
  private static AESEncrypter = new AESTokenEncrypter(ENCRYPTION_KEY);
  private static tokenSerializer = new AESSerializer();
  private static clock = new SystemClock();

  // ===== GETTERS - CLIENTS =====

  static getOAuthClient(serviceProvider: ServiceProvider) {
    switch (serviceProvider) {
      case "google":
        return this.googleClient;
      case "spotify":
        return this.spotifyClient;
    }
  }

  static getGoogleClient() {
    return this.googleClient;
  }

  static getSpotifyClient() {
    return this.spotifyClient;
  }

  static getGoogleMusicClient() {
    return this.googleMusicClient;
  }

  // ===== GETTERS - FACTORIES =====

  static getStrategyFactory() {
    const strategies: Record<ServiceProvider, IOAuthCallbackStrategy> = {
      [ServiceProvider.GOOGLE]: this.getGoogleStrategy(),
      [ServiceProvider.SPOTIFY]: this.getSpotifyStrategy(),
    }
    return new OAuthCallbackStrategyFactory(strategies);
  }

  static getAuthUrlFactory() {
    const authUrlProviders: Record<ServiceProvider, IAuthUrlProvider> = {
      [ServiceProvider.GOOGLE]: this.getGoogleClient(),
      [ServiceProvider.SPOTIFY]: this.getSpotifyClient()
    }
    return new OAuthUrlFactory(authUrlProviders);
  }

  // ===== GETTERS - STRATEGIES =====

  static getGoogleStrategy() {
    return new GoogleOAuthCallbackStrategy(
      this.userRepository,
      this.serviceConnectionRepository,
      this.tokenManager,
      this.clock,
      this.AESEncrypter,
      this.tokenSerializer,
      this.googleClient
    );
  }

  static getSpotifyStrategy() {
    return new SpotifyOAuthCallbackStrategy(
      this.userRepository,
      this.serviceConnectionRepository,
      this.tokenManager,
      this.clock,
      this.AESEncrypter,
      this.tokenSerializer,
      this.spotifyClient
    );
  }

  // ===== GETTERS - PROVIDERS =====

  static getGoogleProvider() {
    return new GoogleAuthProvider();
  }

  static getSpotifyProvider() {
    return new SpotifyAuthProvider();
  }

  static getEmailProvider() {
    return new EmailProvider();
  }

  // ===== GETTERS - SERVICES =====

  static getSyncMusicService() {
    return new SyncMusicService(
      this.getSyncQueue(),
      this.playlistRepository,
      this.AESEncrypter,
      this.tokenSerializer,
      this.getEnsureValidConnectionsUseCase(),
      this.googleMusicClient
    );
  }

  // ===== GETTERS - REPOSITORIES =====

  static getUserRepository() {
    return this.userRepository;
  }

  static getPlaylistRepository() {
    return this.playlistRepository;
  }

  static getTrackRepository() {
    return this.trackRepository;
  }

  static getPlaylistTrackRepository() {
    return this.playlistTrackRepository;
  }

  static getServiceConnectionRepository() {
    return this.serviceConnectionRepository;
  }

  // ===== GETTERS - INFRA =====

  static getOAuthStateStore() {
    return new RedisStateStore<OAuthState>("oauth");
  }

  static getPasswordResetStateStore() {
    return new RedisStateStore<ResetState>("reset");
  }
  static getTokenManager() {
    return this.tokenManager;
  }

  static getPasswordHasher() {
    return this.passwordHasher;
  }

  static getSyncQueue() {
    if (!this.syncQueue) {
      this.syncQueue = new PlaylistSyncQueue();
    }
    return this.syncQueue;
  }

  // ===== GETTERS - USE CASES AUTH =====

  static getSetPasswordUseCase() {
    return new SetPasswordUseCase(
      this.userRepository,
      this.passwordHasher
    );
  }

  static getRequestPasswordResetUseCase() {
    return new RequestPasswordResetUseCase(
      this.userRepository,
      this.getPasswordResetStateStore(),
      this.getEmailProvider()
    )
  }

  static getResetPasswordUseCase() {
    return new ResetPasswordUseCase(
      this.userRepository,
      this.getPasswordResetStateStore(),
      this.passwordHasher
    );
  }

  static getEnsureValidConnectionsUseCase() {
    const providers: Record<ServiceProvider, IAuthProvider> = {
      [ServiceProvider.GOOGLE]: new GoogleAuthProvider(),
      [ServiceProvider.SPOTIFY]: new SpotifyAuthProvider()
    }
    return new EnsureValidConnectionsUseCase(
      this.serviceConnectionRepository,
      this.AESEncrypter,
      this.tokenSerializer,
      this.clock,
      providers
    );
  }

  static getRevokeServiceConnectionUseCase() {
    return new RevokeServiceConnectionUseCase(
      this.serviceConnectionRepository,
      this.AESEncrypter,
      this.tokenSerializer,
      this.getGoogleProvider()
    );
  }

  static getStartOAuthUseCase() {
    return new StartOAuthUseCase(this.getOAuthStateStore(), this.getAuthUrlFactory());
  }

  static getHandleOAuthCallback() {
    return new HandleOAuthCallback(this.getOAuthStateStore(), this.getStrategyFactory())
  }

  static getStartLocalLogin() {
    return new StartLocalLogin(
      this.userRepository,
      this.passwordHasher,
      this.tokenManager,
    );
  }

  static getStartLocalRegister() {
    return new StartLocalRegister(
      this.userRepository,
      this.passwordHasher,
      this.tokenManager,
    );
  }
}