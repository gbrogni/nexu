import { Injectable, Logger } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { UsersRepository } from '@/domain/accounts/repositories/users-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { UserStatus } from '@/domain/accounts/enums';
import { SendConfirmationEmailUseCase } from './send-confirmation-email';

interface ResendConfirmationEmailUseCaseRequest {
  email: string;
}

type ResendConfirmationEmailUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    message: string;
    expiresAt: Date;
  }
>;

@Injectable()
export class ResendConfirmationEmailUseCase {
  private readonly logger = new Logger(ResendConfirmationEmailUseCase.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly sendConfirmationEmailUseCase: SendConfirmationEmailUseCase,
  ) {}

  async execute({
    email,
  }: ResendConfirmationEmailUseCaseRequest): Promise<ResendConfirmationEmailUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      this.logger.warn(`Resend attempt for non-existent email: ${email}`);
      return left(new ResourceNotFoundError());
    }

    if (user.status === UserStatus.ACTIVE) {
      this.logger.warn(`Resend attempt for already active user: ${email}`);
      return left(new NotAllowedError());
    }

    if (user.status !== UserStatus.PENDING_CONFIRMATION) {
      this.logger.warn(`Resend attempt for user with invalid status: ${email}`);
      return left(new NotAllowedError());
    }

    const result = await this.sendConfirmationEmailUseCase.execute({
      userId: user.id.toString(),
      userEmail: user.email!,
      userName: user.name,
    });

    if (result.isLeft()) {
      return left(result.value as Error);
    }

    this.logger.log(`Confirmation email resent to: ${email}`);

    return right({
      message: 'Confirmation email sent successfully',
      expiresAt: result.value.expiresAt,
    });
  }
}