import { Either, left, right } from '@/core/either';
import { WrongCredentialsError } from '@/core/errors/wrong-credentials-error';
import { Injectable } from '@nestjs/common';
import { HashComparer } from '@/domain/cryptography/hash-comparer';
import { Encrypter } from '@/domain/cryptography/encrypter';
import { UsersRepository } from '@/domain/users/repositories/users-repository';
import { User } from '@/domain/users/entities/user';
import { RefreshTokenRepository } from '@/domain/auth/repositories/refresh-token-repository';
import { RefreshToken } from '@/domain/auth/entities/refresh-token';
import { randomBytes } from 'crypto';

interface AuthenticateUserUseCaseRequest {
  email: string;
  password: string;
}

type AuthenticateUserUseCaseResponse = Either<WrongCredentialsError, {
  accessToken: string;
  refreshToken: string;
  user: User;
}>;

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) { }

  async execute({
    email,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user: User | null = await this.usersRepository.findByEmail(email);

    if (!user?.password) {
      return left(new WrongCredentialsError());
    }

    const isPasswordValid: boolean = await this.hashComparer.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      return left(new WrongCredentialsError());
    }

    const accessToken: string = await this.encrypter.encrypt({
      sub: user.id.toString(),
      email: user.email,
      name: user.name,
    });

    const refreshToken: RefreshToken = RefreshToken.create({
      token: this.generateSecureToken(),
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await this.refreshTokenRepository.create(refreshToken);

    return right({
      accessToken,
      refreshToken: refreshToken.token,
      user,
    });
  }

  private generateSecureToken(): string {
    return randomBytes(32).toString('hex');
  }
}