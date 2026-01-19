import { TokenBlacklist } from '../entities/token-blacklist';

export abstract class TokenBlacklistRepository {
  abstract create(tokenBlacklist: TokenBlacklist): Promise<void>;
  abstract findByToken(token: string): Promise<TokenBlacklist | null>;
  abstract deleteExpired(): Promise<void>;
}