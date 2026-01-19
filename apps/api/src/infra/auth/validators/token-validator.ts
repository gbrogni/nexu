import { Injectable } from '@nestjs/common';
import { TokenValidator } from '@/domain/auth/contracts/token-validator.interface';
import { TokenBlacklistService } from '@/application/auth/services/token-blacklist.service';

@Injectable()
export class TokenBlacklistValidator implements TokenValidator {
  constructor(private readonly tokenBlacklistService: TokenBlacklistService) {}

  async isTokenValid(token: string): Promise<boolean> {
    const isBlacklisted: boolean = await this.tokenBlacklistService.isTokenBlacklisted(token);
    return !isBlacklisted;
  }
}