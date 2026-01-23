import { Injectable } from '@nestjs/common';
import { RefreshTokenRepository } from '@/domain/auth/repositories/refresh-token-repository';
import { RefreshToken } from '@/domain/auth/entities/refresh-token';
import { DrizzleRefreshTokenMapper } from '../mappers/drizzle-refresh-token-mapper';
import { eq, lt } from 'drizzle-orm';
import { refreshTokens } from '../../schema';
import { BaseRepository } from '../../base-repository';
import { DatabaseService } from '../../database.service';

@Injectable()
export class DrizzleRefreshTokenRepository extends BaseRepository implements RefreshTokenRepository {
  constructor(protected readonly dbService: DatabaseService) {
    super(dbService);
  }

  async create(refreshToken: RefreshToken): Promise<void> {
    const data = DrizzleRefreshTokenMapper.toDrizzle(refreshToken);
    await this.db.insert(refreshTokens).values(data);
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    const result = await this.db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.token, token))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return DrizzleRefreshTokenMapper.toDomain(result[0]);
  }

  async deleteByToken(token: string): Promise<void> {
    await this.db.delete(refreshTokens).where(eq(refreshTokens.token, token));
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    await this.db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
  }

  async deleteExpired(): Promise<void> {
    await this.db
      .delete(refreshTokens)
      .where(lt(refreshTokens.expiresAt, new Date()));
  }
}