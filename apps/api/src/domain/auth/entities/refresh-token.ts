import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface RefreshTokenProps {
  token: string;
  userId: UniqueEntityID;
  expiresAt: Date;
  isExpired?: boolean;
}

export class RefreshToken extends Entity<RefreshTokenProps> {

  get token(): string {
    return this.props.token;
  }

  get userId(): UniqueEntityID {
    return this.props.userId;
  }

  get expiresAt(): Date {
    return this.props.expiresAt;
  }

  get isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  static create(props: RefreshTokenProps, id?: UniqueEntityID): RefreshToken {
    return new RefreshToken(props, id);
  }

}