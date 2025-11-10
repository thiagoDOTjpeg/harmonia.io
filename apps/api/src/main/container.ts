import { PrismaPlaylistRepository } from '../infrastructure/db/prisma/repositories/PrismaPlaylistRepository';
import { PrismaPlaylistTrackRepository } from '../infrastructure/db/prisma/repositories/PrismaPlaylistTrackRepository';
import { PrismaTrackRepository } from '../infrastructure/db/prisma/repositories/PrismaTrackRepository';
import { PrismaUserRepository } from '../infrastructure/db/prisma/repositories/PrismaUserRepository';

import { GoogleOAuthClient } from '../infrastructure/client/GoogleOAuthClient';

import { BcryptPasswordHasher } from '../infrastructure/crypto/BcryptPasswordHasher';
import { JwtTokenManager } from '../infrastructure/crypto/JwtTokenManager';
import { SystemClock } from '../infrastructure/time/SystemClock';

// Use cases Auth
import { OAuthCallbackStrategy } from '@/application/ports/strategy/OAuthCallbackStrategy';
import { StartGoogleConnect } from '@/application/use_cases/auth/StartGoogleConnect';
import { StartSpotifyConnect } from '@/application/use_cases/auth/StartSpotifyConnect';
import { SyncMusicService } from '@/domain/services/SyncMusicService';
import { GoogleOAuthCallbackStrategy } from '@/infrastructure/adapter/oauth/GoogleOAuthCallbackStrategy';
import { OAuthCallbackStrategyFactory } from '@/infrastructure/adapter/oauth/OAuthCallbackStrategyFactory';
import { SpotifyOAuthCallbackStrategy } from '@/infrastructure/adapter/oauth/SpotifyOAuthCallbackStrategy';
import { AESSerializer } from '@/infrastructure/adapter/serializer/AESSerializer';
import { AESTokenEncrypter } from '@/infrastructure/crypto/AESTokenEncrypter';
import { prisma } from '@/infrastructure/db/prisma/client';
import { PrismaServiceConnectionRepository } from '@/infrastructure/db/prisma/repositories/PrismaServiceConnectionRepository';
import { PlaylistSyncQueue } from '@/infrastructure/queue/PlaylistSyncQueue';
import { ServiceProvider } from '@prisma/client';
import { HandleGoogleCallback } from '../application/use_cases/auth/HandleGoogleCallback';
import { HandleSpotifyCallback } from '../application/use_cases/auth/HandleSpotifyCallback';
import { StartGoogleLogin } from '../application/use_cases/auth/StartGoogleLogin';
import { StartGoogleRegister } from '../application/use_cases/auth/StartGoogleRegister';
import { StartLocalLogin } from '../application/use_cases/auth/StartLocalLogin';
import { StartLocalRegister } from '../application/use_cases/auth/StartLocalRegister';
import { StartSpotifyLogin } from '../application/use_cases/auth/StartSpotifyLogin';
import { StartSpotifyRegister } from '../application/use_cases/auth/StartSpotifyRegister';
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
    const strategies: Record<ServiceProvider, OAuthCallbackStrategy> = {
      [ServiceProvider.GOOGLE]: this.getGoogleStrategy(),
      [ServiceProvider.SPOTIFY]: this.getSpotifyStrategy(),
    }
    return new OAuthCallbackStrategyFactory(strategies);
  }

  static getGoogleStrategy() {
    return new GoogleOAuthCallbackStrategy(
      this.userRepository,
      this.serviceConnectionRepository,
      this.tokenManager,
      this.clock,
      this.AESEncrypter,
      this.tokenSerializer
    );
  }

  static getSpotifyStrategy() {
    return new SpotifyOAuthCallbackStrategy(
      this.userRepository,
      this.serviceConnectionRepository,
      this.tokenManager,
      this.clock,
      this.AESEncrypter,
      this.tokenSerializer
    );
  }

  // ===== GETTERS - SERVICES =====

  static getSyncMusicService() {
    return new SyncMusicService(
      this.serviceConnectionRepository,
      this.playlistRepository,
      this.syncQueue
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

  static getStartGoogleConnect() {
    return new StartGoogleConnect(this.stateStore, this.googleClient);
  }

  static getStartGoogleLogin() {
    return new StartGoogleLogin(this.stateStore, this.googleClient);
  }

  static getStartGoogleRegister() {
    return new StartGoogleRegister(this.stateStore, this.googleClient);
  }

  // TODO: Tech Debt - Remover acoplamento estático do Container (Service Locator pattern)
  static getHandleGoogleCallback() {
    return new HandleGoogleCallback(
      this.stateStore,
      this.googleClient,
    );
  }

  static getStartSpotifyConnect() {
    return new StartSpotifyConnect(this.stateStore, this.spotifyClient);
  }

  static getStartSpotifyLogin() {
    return new StartSpotifyLogin(this.stateStore, this.spotifyClient);
  }

  static getStartSpotifyRegister() {
    return new StartSpotifyRegister(this.stateStore, this.spotifyClient);
  }

  // TODO: Tech Debt - Remover acoplamento estático do Container (Service Locator pattern)
  static getHandleSpotifyCallback() {
    return new HandleSpotifyCallback(
      this.stateStore,
      this.spotifyClient,
    );
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