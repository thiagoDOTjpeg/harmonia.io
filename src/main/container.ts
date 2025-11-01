import { JwtTokenManager } from '../infrastructure/crypto/JwtTokenManager';
import { prisma } from '../infrastructure/db/prisma/client';
import { PrismaUserRepository } from '../infrastructure/db/prisma/repositories/PrismaUserRepository';
import { GoogleOAuthClient } from '../infrastructure/oauth/GoogleOAuthClient';
import { InMemoryStateStore } from '../infrastructure/oauth/InMemoryStateStore';
import { SpotifyOAuthClient } from '../infrastructure/oauth/SpotifyOAuthClient';
import { SystemClock } from '../infrastructure/time/SystemClock';

// Use cases
import { HandleGoogleCallback } from '../application/use_cases/auth/HandleGoogleCallback';
import { HandleSpotifyCallback } from '../application/use_cases/auth/HandleSpotifyCallback';
import { StartGoogleLogin } from '../application/use_cases/auth/StartGoogleLogin';
import { StartGoogleRegister } from '../application/use_cases/auth/StartGoogleRegister';
import { StartSpotifyLogin } from '../application/use_cases/auth/StartSpotifyLogin';
import { StartSpotifyRegister } from '../application/use_cases/auth/StartSpotifyRegister';

export class Container {
  // Infraestrutura (singleton)
  private static googleClient = new GoogleOAuthClient();
  private static spotifyClient = new SpotifyOAuthClient();
  private static stateStore = new InMemoryStateStore();
  private static userRepository = new PrismaUserRepository(prisma);
  private static tokenManager = new JwtTokenManager();
  private static passwordHasher = new BcryptPasswordHasher();
  private static clock = new SystemClock();

  // Google Use Cases
  static getStartGoogleLogin() {
    return new StartGoogleLogin(this.stateStore, this.googleClient);
  }

  static getStartGoogleRegister() {
    return new StartGoogleRegister(this.stateStore, this.googleClient);
  }

  static getHandleGoogleCallback() {
    return new HandleGoogleCallback(
      this.stateStore,
      this.googleClient,
      this.userRepository,
      this.tokenManager,
      this.clock
    );
  }

  // Spotify Use Cases
  static getStartSpotifyLogin() {
    return new StartSpotifyLogin(this.stateStore, this.spotifyClient);
  }

  static getStartSpotifyRegister() {
    return new StartSpotifyRegister(this.stateStore, this.spotifyClient);
  }

  static getHandleSpotifyCallback() {
    return new HandleSpotifyCallback(
      this.stateStore,
      this.spotifyClient,
      this.userRepository,
      this.tokenManager,
      this.clock
    );
  }

  // Local Auth Use Cases
  static getStartLocalRegister() {
    return new StartLocalRegister(
      this.userRepository,
      this.passwordHasher,
      this.tokenManager
    );
  }

  static getStartLocalLogin() {
    return new StartLocalLogin(
      this.userRepository,
      this.passwordHasher,
      this.tokenManager
    );
  }

  // Getters para infraestrutura (middlewares, etc)
  static getUserRepository() {
    return this.userRepository;
  }

  static getTokenManager() {
    return this.tokenManager;
  }
}