import { PrismaPlaylistRepository } from '../infrastructure/db/prisma/repositories/PrismaPlaylistRepository';
import { PrismaPlaylistTrackRepository } from '../infrastructure/db/prisma/repositories/PrismaPlaylistTrackRepository';
import { PrismaTrackRepository } from '../infrastructure/db/prisma/repositories/PrismaTrackRepository';
import { PrismaUserRepository } from '../infrastructure/db/prisma/repositories/PrismaUserRepository';

import { GoogleOAuthClient } from '../infrastructure/client/GoogleOAuthClient';

import { BcryptPasswordHasher } from '../infrastructure/crypto/BcryptPasswordHasher';
import { JwtTokenManager } from '../infrastructure/crypto/JwtTokenManager';
import { SystemClock } from '../infrastructure/time/SystemClock';

// Use cases Auth
import { prisma } from '@/infrastructure/db/prisma/client';
import { PrismaServiceConnectionRepository } from '@/infrastructure/db/prisma/repositories/PrismaServiceConnectionRepository';
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

export class Container {
  // Infra
  private static googleClient = new GoogleOAuthClient();
  private static spotifyClient = new SpotifyOAuthClient();
  private static stateStore = new RedisStateStore();

  // Repositories
  private static userRepository = new PrismaUserRepository(prisma);
  private static playlistRepository = new PrismaPlaylistRepository(prisma);
  private static trackRepository = new PrismaTrackRepository(prisma);
  private static playlistTrackRepository = new PrismaPlaylistTrackRepository(prisma);
  private static serviceConnectionRepository = new PrismaServiceConnectionRepository(prisma);

  // Crypto & Time
  private static tokenManager = new JwtTokenManager();
  private static passwordHasher = new BcryptPasswordHasher();
  private static clock = new SystemClock();

  // ===== GETTERS - CLIENTS =====

  static getGoogleClient() {
    return this.googleClient;
  }

  static getSpotifyClient() {
    return this.spotifyClient;
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

  // ===== GETTERS - USE CASES AUTH =====

  static getStartGoogleLogin() {
    return new StartGoogleLogin(this.stateStore, this.googleClient);
  }

  static getStartGoogleRegister() {
    return new StartGoogleRegister(this.stateStore, this.googleClient);
  }

  static getHandleGoogleCallback(userId: string | undefined) {
    return new HandleGoogleCallback(
      this.stateStore,
      this.googleClient,
      this.serviceConnectionRepository,
      this.userRepository,
      this.tokenManager,
      this.clock,
      userId
    );
  }

  static getStartSpotifyLogin() {
    return new StartSpotifyLogin(this.stateStore, this.spotifyClient);
  }

  static getStartSpotifyRegister() {
    return new StartSpotifyRegister(this.stateStore, this.spotifyClient);
  }

  static getHandleSpotifyCallback(userId: string | undefined) {
    return new HandleSpotifyCallback(
      this.stateStore,
      this.spotifyClient,
      this.serviceConnectionRepository,
      this.userRepository,
      this.tokenManager,
      this.clock,
      userId
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