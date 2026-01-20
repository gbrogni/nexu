import { User } from '@/domain/accounts/entities';

export class AuthSession {
  constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string,
    public readonly user: User,
  ) { }
}