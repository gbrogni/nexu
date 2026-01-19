import { RefreshToken } from '../entities/refresh-token';

export abstract class RefreshTokenRepository {
  abstract create(refreshToken: RefreshToken): Promise<void>;
  abstract findByToken(token: string): Promise<RefreshToken | null>;
  abstract deleteByToken(token: string): Promise<void>;
  abstract deleteAllByUserId(userId: string): Promise<void>;
  abstract deleteExpired(): Promise<void>;
}