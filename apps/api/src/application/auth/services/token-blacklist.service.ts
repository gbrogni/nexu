import { Injectable } from '@nestjs/common';
import { TokenBlacklistRepository } from '@/domain/auth/repositories/token-blacklist-repository';

@Injectable()
export class TokenBlacklistService {
  constructor(
    private readonly tokenBlacklistRepository: TokenBlacklistRepository,
  ) { }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const blacklistedToken = await this.tokenBlacklistRepository.findByToken(token);
    return !!blacklistedToken;
  }
}