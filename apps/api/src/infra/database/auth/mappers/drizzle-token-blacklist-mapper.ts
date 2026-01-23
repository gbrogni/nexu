import { TokenBlacklist } from '@/domain/auth/entities/token-blacklist';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { tokenBlacklist } from '../../schema';

export class DrizzleTokenBlacklistMapper {
  static toDomain(raw: typeof tokenBlacklist.$inferSelect): TokenBlacklist {
    return TokenBlacklist.create({
      token: raw.token,
      expiresAt: raw.expiresAt,
      createdAt: raw.createdAt,
    }, new UniqueEntityID(raw.id));
  }

  static toDrizzle(tokenBlacklistEntity: TokenBlacklist): typeof tokenBlacklist.$inferInsert {
    return {
      id: tokenBlacklistEntity.id.toString(),
      token: tokenBlacklistEntity.token,
      expiresAt: tokenBlacklistEntity.expiresAt,
      createdAt: tokenBlacklistEntity.createdAt,
    };
  }
}