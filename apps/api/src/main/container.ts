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
import { IOAuthCallbackStrategy } from '@/application/ports/strategy/IOAuthCallbackStrategy';
import { GoogleAuthProvider } from '@/application/providers/GoogleAuthProvider';
import { SpotifyAuthProvider } from '@/application/providers/SpotifyAuthProvider';
import { SyncMusicService } from '@/application/services/SyncMusicService';
import { StartOAuthUseCase } from '@/application/use_cases/auth/StartOAuthUseCase';
import { EnsureValidConnectionsUseCase } from '@/application/use_cases/sync_playlist/EnsureValidConnectionsUseCase';
import { GoogleOAuthCallbackStrategy } from '@/infrastructure/adapter/oauth/GoogleOAuthCallbackStrategy';
import { OAuthCallbackStrategyFactory } from '@/infrastructure/adapter/oauth/OAuthCallbackStrategyFactory';
import { SpotifyOAuthCallbackStrategy } from '@/infrastructure/adapter/oauth/SpotifyOAuthCallbackStrategy';
import { AESSerializer } from '@/infrastructure/adapter/serializer/AESSerializer';
import { AESTokenEncrypter } from '@/infrastructure/crypto/AESTokenEncrypter';
import { prisma } from '@/infrastructure/db/prisma/client';
import { PrismaServiceConnectionRepository } from '@/infrastructure/db/prisma/repositories/PrismaServiceConnectionRepository';
import { PlaylistSyncQueue } from '@/infrastructure/queue/PlaylistSyncQueue';
import { ServiceProvider } from '@prisma/client';
import { StartLocalLogin } from '../application/use_cases/auth/StartLocalLogin';
import { StartLocalRegister } from '../application/use_cases/auth/StartLocalRegister';
import { SpotifyOAuthClient } from '../infrastructure/client/SpotifyOAuthClient';
import { RedisStateStore } from '../infrastructure/state/RedisStateStore';

const ENCRYPTION_KEY: string = process.env.AES_SECRET || "";

export class Container {

  // Infra
  private static googleClient = new GoogleOAuthClient();
  private static spotifyClient = new SpotifyOAuthClient();
  private static stateStore = new RedisStateStore();
  private static syncQueue = new PlaylistSyncQueue();

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

  static getGoogleClient() {
    return this.googleClient;
  }

  static getSpotifyClient() {
    return this.spotifyClient;
  }

  // ===== GETTERS - FACTORIES =====

  static getStrategyFactory() {
    const strategies: Record<ServiceProvider, IOAuthCallbackStrategy> = {
      [ServiceProvider.GOOGLE]: this.getGoogleStrategy(),
      [ServiceProvider.SPOTIFY]: this.getSpotifyStrategy(),
    }
    return new OAuthCallbackStrategyFactory(strategies);
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


  // ===== GETTERS - SERVICES =====

  static getSyncMusicService() {
    return new SyncMusicService(
      this.syncQueue,
      this.playlistRepository,
      this.AESEncrypter,
      this.tokenSerializer,
      this.getEnsureValidConnectionsUseCase()
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

  static getStateManager() {
    return this.stateStore;
  }

  static getTokenManager() {
    return this.tokenManager;
  }

  static getPasswordHasher() {
    return this.passwordHasher;
  }

  static getSyncQueue() {
    return this.syncQueue;
  }

  // ===== GETTERS - USE CASES AUTH =====

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

  static getStartOAuthUseCase() {
    return new StartOAuthUseCase(this.stateStore);
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