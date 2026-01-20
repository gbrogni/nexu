import { Either, left, right } from '@/core/either';
import { ProfilePictureUrl } from '@/domain/accounts/value-objects/profile-picture-url';
import { UserRole, UserStatus } from '@/domain/accounts/enums';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Encrypter } from '@/domain/cryptography/encrypter';
import { UsersRepository } from '@/domain/accounts/repositories/users-repository';
import { UserAlreadyExistsError } from '@/core/errors/user-already-exists-error';
import { BadRequestException, Injectable } from '@nestjs/common';
import { RefreshToken } from '@/domain/auth/entities/refresh-token';
import { randomBytes } from 'crypto';
import { RefreshTokenRepository } from '@/domain/auth/repositories/refresh-token-repository';
import { User } from '@/domain/accounts/entities';
import { AuthProvider } from '@/domain/accounts/enums';

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
          authProvider: AuthProvider.GOOGLE,
          profilePicture: pictureUrl ? ProfilePictureUrl.create(pictureUrl) : undefined,
          authProviderId: providerId,
          companyId: new UniqueEntityID(),
          role: UserRole.ADMIN,
          status: UserStatus.ACTIVE,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        await this.usersRepository.create(newUser);
        user = newUser;
      } catch (error) {
        const errorMessage: string = error instanceof Error ? error.message : String(error);
        return left(new BadRequestException(`Failed to create user: ${errorMessage}`));
      }
    } else if (user.authProvider !== AuthProvider.GOOGLE || user.authProviderId !== providerId) {
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