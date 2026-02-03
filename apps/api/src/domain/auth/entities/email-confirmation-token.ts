import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ConfirmationToken } from '../value-objects/confirmation-token';

export interface EmailConfirmationTokenProps {
  userId: UniqueEntityID;
  token: ConfirmationToken;
  expiresAt: Date;
  confirmedAt?: Date;
  createdAt: Date;
}

export class EmailConfirmationToken extends Entity<EmailConfirmationTokenProps> {

  get userId(): UniqueEntityID {
    return this.props.userId;
  }

  get token(): ConfirmationToken {
    return this.props.token;
  }

  get expiresAt(): Date {
    return this.props.expiresAt;
  }

  get confirmedAt(): Date | undefined {
    return this.props.confirmedAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  get isConfirmed(): boolean {
    return !!this.confirmedAt;
  }

  /**
   * Marca o token como confirmado
   * 
   * Nota: Em DDD puro, isso mudaria o estado e dispararia um evento.
   * Para simplificar, estamos apenas marcando.
   */
  confirm(): void {
    if (this.isConfirmed) {
      throw new Error('Token already confirmed');
    }

    if (this.isExpired) {
      throw new Error('Token has expired');
    }

    this.props.confirmedAt = new Date();
  }

  static create(
    userId: UniqueEntityID,
    expirationHours: number = 24,
  ): EmailConfirmationToken {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + expirationHours * 60 * 60 * 1000);

    return new EmailConfirmationToken(
      {
        userId,
        token: ConfirmationToken.generate(),
        expiresAt,
        createdAt: now,
      },
    );
  }

  static reconstitute(
    props: EmailConfirmationTokenProps,
    id: UniqueEntityID,
  ): EmailConfirmationToken {
    return new EmailConfirmationToken(props, id);
  }
}