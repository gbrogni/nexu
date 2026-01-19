import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { AuthProvider } from './types/auth-provider';
import { ProfilePictureUrl } from './value-objects/profile-picture-url';

export interface UserProps {
  name: string;
  email: string;
  authProvider: AuthProvider;
  password?: string;
  profilePicture?: ProfilePictureUrl;
  providerId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User extends Entity<UserProps> {

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get authProvider(): AuthProvider {
    return this.props.authProvider;
  }

  get password(): string | undefined {
    return this.props.password;
  }

  get profilePicture(): ProfilePictureUrl | undefined {
    return this.props.profilePicture;
  }

  get providerId(): string | undefined {
    return this.props.providerId;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  static create(props: UserProps, id?: UniqueEntityID) {
    return new User(props, id);
  }

}