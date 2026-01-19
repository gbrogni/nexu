import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { TokenBlacklist } from '@/domain/auth/entities/token-blacklist';
import { RefreshTokenRepository } from '@/domain/auth/repositories/refresh-token-repository';
import { TokenBlacklistRepository } from '@/domain/auth/repositories/token-blacklist-repository';
import { Encrypter } from '@/domain/cryptography/encrypter';
import { Injectable } from '@nestjs/common';

interface LogoutUseCaseRequest {
  accessToken: string;
  userId: string;
}

type LogoutUseCaseResponse = Either<ResourceNotFoundError, void>;

@Injectable()
export class LogoutUseCase {
  constructor(
    private readonly tokenBlacklistRepository: TokenBlacklistRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly encrypter: Encrypter,
  ) { }

  async execute({
    accessToken,
    userId,
  }: LogoutUseCaseRequest): Promise<LogoutUseCaseResponse> {
    try {
      const decoded: Record<string, unknown> = await this.encrypter.decrypt(accessToken);
      const tokenUserId = decoded.sub as string;

      if (tokenUserId !== userId) {
        return left(new NotAllowedError());
      }

      const expiresAt = new Date((decoded.exp as number) * 1000);

      const blacklistedToken: TokenBlacklist = TokenBlacklist.create({
        token: accessToken,
        expiresAt,
      });

      await this.tokenBlacklistRepository.create(blacklistedToken);
      await this.refreshTokenRepository.deleteAllByUserId(userId);
      return right(undefined);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Invalid or expired token')) {
        return left(new NotAllowedError());
      }

      return left(new ResourceNotFoundError());
    }
  }
}