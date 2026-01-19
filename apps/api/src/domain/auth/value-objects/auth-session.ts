import { User } from '@/domain/users/entities/user';

export class AuthSession {
  constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string,
    public readonly user: User,
  ) { }
}