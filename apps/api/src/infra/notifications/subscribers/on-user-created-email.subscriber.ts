import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventHandler } from '@/core/events/event-handler';
import { DomainEvents } from '@/core/events/domain-events';
import { UserCreatedEvent } from '@/domain/accounts/events/user-created.event';
import { UserStatus, AuthProvider } from '@/domain/accounts/enums';
import { SendConfirmationEmailUseCase } from '../../../application/notifications/use-cases/send-confirmation-email';

@Injectable()
export class OnUserCreatedEmailSubscriber implements EventHandler, OnModuleInit {
  private readonly logger = new Logger(OnUserCreatedEmailSubscriber.name);

  constructor(
    private readonly sendConfirmationEmailUseCase: SendConfirmationEmailUseCase,
  ) {}

  onModuleInit() {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.handleUserCreated.bind(this),
      UserCreatedEvent.name,
    );
  }

  private async handleUserCreated(event: UserCreatedEvent): Promise<void> {
    const { user } = event;

    if (!user.email) {
      this.logger.debug(`User ${user.id} created without email, skipping confirmation`);
      return;
    }

    if (user.status !== UserStatus.PENDING_CONFIRMATION) {
      this.logger.debug(
        `User ${user.email} created with status ${user.status}, skipping confirmation`,
      );
      return;
    }

    if (user.authProvider !== AuthProvider.LOCAL) {
      this.logger.debug(
        `User ${user.email} created via ${user.authProvider}, skipping confirmation`,
      );
      return;
    }

    try {
      const result = await this.sendConfirmationEmailUseCase.execute({
        userId: user.id.toString(),
        userEmail: user.email,
        userName: user.name,
      });

      if (result.isLeft()) {
        this.logger.error(
          `Failed to send confirmation email to ${user.email}`,
          result.value,
        );
        return;
      }

      this.logger.log(
        `Confirmation email sent to ${user.email} (expires at ${result.value.expiresAt})`,
      );
    } catch (error) {
      this.logger.error(
        `Error sending confirmation email to ${user.email}`,
        error,
      );
    }
  }
}