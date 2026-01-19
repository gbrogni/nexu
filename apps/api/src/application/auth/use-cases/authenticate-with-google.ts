import { Either, left, right } from '@/core/either';
import { ProfilePictureUrl } from '@/domain/users/entities/value-objects/profile-picture-url';
import { Encrypter } from '@/domain/cryptography/encrypter';
import { User } from '@/domain/users/entities/user';
import { UsersRepository } from '@/domain/users/repositories/users-repository';
import { UserAlreadyExistsError } from '@/core/errors/user-already-exists-error';
import { BadRequestException, Injectable } from '@nestjs/common';
import { RefreshToken } from '@/domain/auth/entities/refresh-token';
import { randomBytes } from 'crypto';
import { RefreshTokenRepository } from '@/domain/auth/repositories/refresh-token-repository';

interface AuthenticateWithGoogleUseCaseRequest {
  email: string;
  name: string;
  pictureUrl: string;
  providerId: string;
}

type AuthenticateWithGoogleUseCaseResponse = Either<
  UserAlreadyExistsError | BadRequestException,
  {
    accessToken: string;
    refreshToken: string;
    user: User;
  }
>;

@Injectable()
export class AuthenticateWithGoogleUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly encrypter: Encrypter,
  ) { }

  async execute({
    email,
    name,
    pictureUrl,
    providerId,
  }: AuthenticateWithGoogleUseCaseRequest): Promise<AuthenticateWithGoogleUseCaseResponse> {
    let user: User | null = await this.usersRepository.findByEmail(email);

    if (!user) {
      try {
        const newUser: User = User.create({
          name,
          email,
          authProvider: 'GOOGLE',
          profilePicture: pictureUrl ? ProfilePictureUrl.create(pictureUrl) : undefined,
          providerId,
        });

        await this.usersRepository.create(newUser);
        user = newUser;
      } catch (error) {
        const errorMessage: string = error instanceof Error ? error.message : String(error);
        return left(new BadRequestException(`Failed to create user: ${errorMessage}`));
      }
    } else if (user.authProvider !== 'GOOGLE' || user.providerId !== providerId) {
      return left(new UserAlreadyExistsError(
        `User with email ${email} already exists with different authentication provider`
      ));
    }

    const accessToken: string = await this.encrypter.encrypt({
      sub: user.id.toString(),
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