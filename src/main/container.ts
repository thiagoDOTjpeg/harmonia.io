import { prisma } from '../infrastructure/db/prisma/client';
import { PrismaPlaylistRepository } from '../infrastructure/db/prisma/repositories/PrismaPlaylistRepository';
import { PrismaPlaylistTrackRepository } from '../infrastructure/db/prisma/repositories/PrismaPlaylistTrackRepository';
import { PrismaTrackRepository } from '../infrastructure/db/prisma/repositories/PrismaTrackRepository';
import { PrismaUserRepository } from '../infrastructure/db/prisma/repositories/PrismaUserRepository';


import { BcryptPasswordHasher } from '../infrastructure/crypto/BcryptPasswordHasher';
import { JwtTokenManager } from '../infrastructure/crypto/JwtTokenManager';
import { SystemClock } from '../infrastructure/time/SystemClock';

// Use cases Auth
import { HandleGoogleCallback } from '../application/use_cases/auth/HandleGoogleCallback';
import { HandleSpotifyCallback } from '../application/use_cases/auth/HandleSpotifyCallback';
import { StartGoogleLogin } from '../application/use_cases/auth/StartGoogleLogin';
import { StartGoogleRegister } from '../application/use_cases/auth/StartGoogleRegister';
import { StartLocalLogin } from '../application/use_cases/auth/StartLocalLogin';
import { StartLocalRegister } from '../application/use_cases/auth/StartLocalRegister';
import { StartSpotifyLogin } from '../application/use_cases/auth/StartSpotifyLogin';
import { StartSpotifyRegister } from '../application/use_cases/auth/StartSpotifyRegister';

// Use case Sync
import { SyncYouTubePlaylistToSpotify } from '../application/use_cases/sync/SyncYouTubePlaylistToSpotify';
import { GoogleOAuthClient } from '../infrastructure/client/GoogleOAuthClient';
import { SpotifyOAuthClient } from '../infrastructure/client/SpotifyOAuthClient';
import { RedisStateStore } from '../infrastructure/state/RedisStateStore';

export class Container {
  private static googleClient = new GoogleOAuthClient();
  private static spotifyClient = new SpotifyOAuthClient();
  private static stateStore = new RedisStateStore();

  private static userRepository = new PrismaUserRepository(prisma);
  private static playlistRepository = new PrismaPlaylistRepository(prisma);
  private static trackRepository = new PrismaTrackRepository(prisma);
  private static playlistTrackRepository = new PrismaPlaylistTrackRepository(prisma);

  private static tokenManager = new JwtTokenManager();
  private static passwordHasher = new BcryptPasswordHasher();
  private static clock = new SystemClock();

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

  static getTokenManager() {
    return this.tokenManager;
  }

  static getPasswordHasher() {
    return this.passwordHasher;
  }

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
      this.clock,
    );
  }

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
      this.clock,
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

  static getSyncYouTubePlaylistToSpotify() {
    return new SyncYouTubePlaylistToSpotify(
      this.playlistRepository,
      this.trackRepository,
      this.playlistTrackRepository,
      this.googleClient,
    );
  }
}