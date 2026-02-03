import { Injectable, Logger } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { IEmailService } from '@/domain/notifications/contracts/email-service.interface';
import { EmailConfirmationToken } from '@/domain/auth/entities/email-confirmation-token';
import { EmailConfirmationTokenRepository } from '@/domain/auth/repositories/email-confirmation-token-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { EnvService } from '@/infra/env/env.service';

interface SendConfirmationEmailUseCaseRequest {
  userId: string;
  userEmail: string;
  userName: string;
}

type SendConfirmationEmailUseCaseResponse = Either<
  Error,
  {
    tokenId: string;
    expiresAt: Date;
  }
>;

@Injectable()
export class SendConfirmationEmailUseCase {
  private readonly logger = new Logger(SendConfirmationEmailUseCase.name);

  constructor(
    private readonly emailService: IEmailService,
    private readonly tokenRepository: EmailConfirmationTokenRepository,
    private readonly envService: EnvService,
  ) { }

  async execute({
    userId,
    userEmail,
    userName,
  }: SendConfirmationEmailUseCaseRequest): Promise<SendConfirmationEmailUseCaseResponse> {
    try {
      await this.tokenRepository.deleteAllByUserId(userId);

      const confirmationToken = EmailConfirmationToken.create(
        new UniqueEntityID(userId),
        24,
      );

      await this.tokenRepository.create(confirmationToken);

      const frontendUrl = this.envService.get('FRONTEND_URL');
      const confirmationUrl = `${frontendUrl}/auth/confirm-email?token=${confirmationToken.token.getValue()}`;

      const result = await this.emailService.sendConfirmationEmail(
        userEmail,
        userName,
        confirmationUrl,
      );

      if (!result.success) {
        this.logger.error(`Failed to send confirmation email to ${userEmail}`);
        return left(new Error('Failed to send confirmation email'));
      }

      this.logger.log(`Confirmation email sent to ${userEmail} (messageId: ${result.messageId})`);

      return right({
        tokenId: confirmationToken.id.toString(),
        expiresAt: confirmationToken.expiresAt,
      });
    } catch (error) {
      this.logger.error('Error in SendConfirmationEmailUseCase', error);
      return left(error as Error);
    }
  }
}