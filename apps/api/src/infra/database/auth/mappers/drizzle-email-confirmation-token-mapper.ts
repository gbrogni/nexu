import { EmailConfirmationToken } from '@/domain/auth/entities/email-confirmation-token';
import { ConfirmationToken } from '@/domain/auth/value-objects/confirmation-token';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { emailConfirmationTokens } from '../../schema';

type DrizzleEmailConfirmationToken = typeof emailConfirmationTokens.$inferSelect;

export class DrizzleEmailConfirmationTokenMapper {
  static toDrizzle(token: EmailConfirmationToken): typeof emailConfirmationTokens.$inferInsert {
    return {
      id: token.id.toString(),
      userId: token.userId.toString(),
      token: token.token.getValue(),
      expiresAt: token.expiresAt,
      confirmedAt: token.confirmedAt ?? null,
      createdAt: token.createdAt,
    };
  }

  static toDomain(raw: DrizzleEmailConfirmationToken): EmailConfirmationToken {
    return EmailConfirmationToken.reconstitute(
      {
        userId: new UniqueEntityID(raw.userId),
        token: ConfirmationToken.create(raw.token),
        expiresAt: raw.expiresAt,
        confirmedAt: raw.confirmedAt ?? undefined,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    );
  }
}