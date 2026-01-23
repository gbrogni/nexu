import { Injectable } from '@nestjs/common';
import { TokenBlacklistRepository } from '@/domain/auth/repositories/token-blacklist-repository';
import { TokenBlacklist } from '@/domain/auth/entities/token-blacklist';
import { DrizzleTokenBlacklistMapper } from '../mappers/drizzle-token-blacklist-mapper';
import { eq, lt } from 'drizzle-orm';
import { BaseRepository } from '../../base-repository';
import { DatabaseService } from '../../database.service';
import { tokenBlacklist } from '../../schema';

@Injectable()
export class DrizzleTokenBlacklistRepository extends BaseRepository implements TokenBlacklistRepository {
  constructor(protected readonly dbService: DatabaseService) {
    super(dbService);
  }

  async create(tokenBlacklistEntity: TokenBlacklist): Promise<void> {
    const data = DrizzleTokenBlacklistMapper.toDrizzle(tokenBlacklistEntity);
    await this.db.insert(tokenBlacklist).values(data);
  }

  async findByToken(token: string): Promise<TokenBlacklist | null> {
    const result = await this.db
      .select()
      .from(tokenBlacklist)
      .where(eq(tokenBlacklist.token, token))
      .limit(1);
    
    if (result.length === 0) {
      return null;
    }

    return DrizzleTokenBlacklistMapper.toDomain(result[0]);
  }

  async deleteExpired(): Promise<void> {
    await this.db
      .delete(tokenBlacklist)
      .where(lt(tokenBlacklist.expiresAt, new Date()));
  }
}