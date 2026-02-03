import { Injectable, Logger } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { EmailConfirmationTokenRepository } from '@/domain/auth/repositories/email-confirmation-token-repository';
import { UsersRepository } from '@/domain/accounts/repositories/users-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { UserStatus } from '@/domain/accounts/enums';
import { User } from '@/domain/accounts/entities';

interface ConfirmEmailUseCaseRequest {
  token: string;
}

type ConfirmEmailUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    user: User;
  }
>;

@Injectable()
export class ConfirmEmailUseCase {
  private readonly logger = new Logger(ConfirmEmailUseCase.name);

  constructor(
    private readonly tokenRepository: EmailConfirmationTokenRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute({
    token,
  }: ConfirmEmailUseCaseRequest): Promise<ConfirmEmailUseCaseResponse> {
    const confirmationToken = await this.tokenRepository.findByToken(token);

    if (!confirmationToken) {
      this.logger.warn(`Token not found: ${token}`);
      return left(new ResourceNotFoundError());
    }

    if (confirmationToken.isExpired) {
      this.logger.warn(`Expired token used: ${token}`);
      await this.tokenRepository.delete(confirmationToken.id.toString());
      return left(new NotAllowedError());
    }

    if (confirmationToken.isConfirmed) {
      this.logger.warn(`Already confirmed token used: ${token}`);
      return left(new NotAllowedError());
    }

    const user = await this.usersRepository.findById(
      confirmationToken.userId.toString(),
    );

    if (!user) {
      this.logger.error(`User not found for token: ${confirmationToken.userId}`);
      return left(new ResourceNotFoundError());
    }

    if (user.status === UserStatus.ACTIVE) {
      this.logger.warn(`User already active: ${user.email}`);
      await this.tokenRepository.delete(confirmationToken.id.toString());
      return right({ user });
    }

    // 5. Ativar conta
    user.activate();

    await this.usersRepository.update(user);

    // 6. Marcar token como confirmado e deletar
    confirmationToken.confirm();
    await this.tokenRepository.delete(confirmationToken.id.toString());

    this.logger.log(`Email confirmed for user: ${user.email}`);

    return right({ user });
  }
}