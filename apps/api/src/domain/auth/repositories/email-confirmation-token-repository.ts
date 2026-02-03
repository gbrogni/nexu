import { EmailConfirmationToken } from '../entities/email-confirmation-token';

export abstract class EmailConfirmationTokenRepository {
  abstract create(token: EmailConfirmationToken): Promise<void>;
  abstract findByToken(token: string): Promise<EmailConfirmationToken | null>;
  abstract findActiveByUserId(userId: string): Promise<EmailConfirmationToken | null>;
  abstract delete(id: string): Promise<void>;
  abstract deleteAllByUserId(userId: string): Promise<void>;
  abstract deleteExpired(): Promise<void>;
}