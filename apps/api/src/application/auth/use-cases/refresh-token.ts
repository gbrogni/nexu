import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { RefreshTokenRepository } from '@/domain/auth/repositories/refresh-token-repository';
import { Encrypter } from '@/domain/cryptography/encrypter';
import { RefreshToken } from '@/domain/auth/entities/refresh-token';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { randomBytes } from 'crypto';

interface RefreshAccessTokenUseCaseRequest {
  refreshToken: string;
}

type RefreshAccessTokenUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { 
    accessToken: string;
    refreshToken: string;
  }
>;

@Injectable()
export class RefreshAccessTokenUseCase {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly encrypter: Encrypter,
  ) { }

  async execute({
    refreshToken,
  }: RefreshAccessTokenUseCaseRequest): Promise<RefreshAccessTokenUseCaseResponse> {
    const storedToken: RefreshToken | null = await this.refreshTokenRepository.findByToken(refreshToken);

    if (!storedToken) {
      return left(new ResourceNotFoundError());
    }

    if (storedToken.isExpired) {
      await this.refreshTokenRepository.deleteByToken(refreshToken);
      return left(new NotAllowedError());
    }

    const accessToken: string = await this.encrypter.encrypt({
      sub: storedToken.userId.toString(),
    });

    await this.refreshTokenRepository.deleteByToken(refreshToken);
    
    const newRefreshToken = RefreshToken.create({
      token: this.generateSecureToken(),
      userId: storedToken.userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await this.refreshTokenRepository.create(newRefreshToken);

    return right({
      accessToken,
      refreshToken: newRefreshToken.token,
    });
  }

  private generateSecureToken(): string {
    return randomBytes(32).toString('hex');
  }
}