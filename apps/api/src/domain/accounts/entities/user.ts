import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ProfilePictureUrl } from '../value-objects/profile-picture-url';
import { UserRole, UserStatus, AuthProvider } from '../enums';

export interface UserProps {
  companyId: UniqueEntityID;
  name: string;
  email?: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  passwordHash?: string;
  authProvider: AuthProvider;
  authProviderId?: string;
  profilePicture?: ProfilePictureUrl;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class User extends Entity<UserProps> {

  get companyId(): UniqueEntityID {
    return this.props.companyId;
  }

  get name(): string {
    return this.props.name;
  }

  get email(): string | undefined {
    return this.props.email;
  }

  get phone(): string | undefined {
    return this.props.phone;
  }

  get role(): UserRole {
    return this.props.role;
  }

  get status(): UserStatus {
    return this.props.status;
  }

  get passwordHash(): string | undefined {
    return this.props.passwordHash;
  }

  get authProvider(): AuthProvider {
    return this.props.authProvider;
  }

  get profilePicture(): ProfilePictureUrl | undefined {
    return this.props.profilePicture;
  }

  get authProviderId(): string | undefined {
    return this.props.authProviderId;
  }

  get lastLoginAt(): Date | undefined {
    return this.props.lastLoginAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  static create(props: UserProps, id?: UniqueEntityID) {
    return new User(props, id);
  }

}