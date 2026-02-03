import { Injectable } from '@nestjs/common';
import { eq, and, isNull, gt, lt } from 'drizzle-orm';
import { EmailConfirmationTokenRepository } from '@/domain/auth/repositories/email-confirmation-token-repository';
import { EmailConfirmationToken } from '@/domain/auth/entities/email-confirmation-token';
import { BaseRepository } from '../../base-repository';
import { DatabaseService } from '../../database.service';
import { DrizzleEmailConfirmationTokenMapper } from '../mappers/drizzle-email-confirmation-token-mapper';
import { emailConfirmationTokens } from '../../schema';

@Injectable()
export class DrizzleEmailConfirmationTokenRepository extends BaseRepository implements EmailConfirmationTokenRepository {
  constructor(protected readonly dbService: DatabaseService) {
    super(dbService);
  }

  async create(token: EmailConfirmationToken): Promise<void> {
    const data = DrizzleEmailConfirmationTokenMapper.toDrizzle(token);
    await this.db.insert(emailConfirmationTokens).values(data);
  }

  async findByToken(token: string): Promise<EmailConfirmationToken | null> {
    const result = await this.db
      .select()
      .from(emailConfirmationTokens)
      .where(eq(emailConfirmationTokens.token, token))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return DrizzleEmailConfirmationTokenMapper.toDomain(result[0]);
  }

  async findActiveByUserId(userId: string): Promise<EmailConfirmationToken | null> {
    const now = new Date();

    const result = await this.db
      .select()
      .from(emailConfirmationTokens)
      .where(
        and(
          eq(emailConfirmationTokens.userId, userId),
          isNull(emailConfirmationTokens.confirmedAt),
          gt(emailConfirmationTokens.expiresAt, now),
        ),
      )
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return DrizzleEmailConfirmationTokenMapper.toDomain(result[0]);
  }

  async delete(id: string): Promise<void> {
    await this.db
      .delete(emailConfirmationTokens)
      .where(eq(emailConfirmationTokens.id, id));
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    await this.db
      .delete(emailConfirmationTokens)
      .where(eq(emailConfirmationTokens.userId, userId));
  }

  async deleteExpired(): Promise<void> {
    const now = new Date();

    await this.db
      .delete(emailConfirmationTokens)
      .where(lt(emailConfirmationTokens.expiresAt, now));
  }
}