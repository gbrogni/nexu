import { RefreshToken } from '@/domain/auth/entities/refresh-token';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { refreshTokens } from '../../schema';

export class DrizzleRefreshTokenMapper {
  static toDomain(raw: typeof refreshTokens.$inferSelect): RefreshToken {
    return RefreshToken.create({
      token: raw.token,
      userId: new UniqueEntityID(raw.userId),
      expiresAt: raw.expiresAt,
    }, new UniqueEntityID(raw.id));
  }

  static toDrizzle(refreshToken: RefreshToken): typeof refreshTokens.$inferInsert {
    return {
      id: refreshToken.id.toString(),
      token: refreshToken.token,
      userId: refreshToken.userId.toString(),
      expiresAt: refreshToken.expiresAt,
    };
  }
}