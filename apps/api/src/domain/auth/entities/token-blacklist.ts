import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface TokenBlacklistProps {
  token: string;
  expiresAt: Date;
  createdAt?: Date;
}

export class TokenBlacklist extends Entity<TokenBlacklistProps> {

  get token(): string {
    return this.props.token;
  }

  get expiresAt(): Date {
    return this.props.expiresAt;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  static create(props: TokenBlacklistProps, id?: UniqueEntityID): TokenBlacklist {
    const tokenBlacklist = new TokenBlacklist({
      ...props,
      createdAt: props.createdAt ?? new Date(),
    }, id);

    return tokenBlacklist;
  }

}