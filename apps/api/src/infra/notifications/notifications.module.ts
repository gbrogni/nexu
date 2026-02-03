import { Module } from '@nestjs/common';
import { EmailModule } from '@/infra/email/email.module';
import { AuthModule } from '@/infra/auth/auth.module';
import { SendConfirmationEmailUseCase } from '@/application/notifications/use-cases/send-confirmation-email';
import { ResendConfirmationEmailUseCase } from '@/application/notifications/use-cases/resend-confirmation-email';
import { OnUserCreatedEmailSubscriber } from '@/infra/notifications/subscribers/on-user-created-email.subscriber';
import { ResendConfirmationEmailController } from '../auth/controllers/resend-confirmation-email.controller';

@Module({
  imports: [EmailModule, AuthModule],
  controllers: [ResendConfirmationEmailController],
  providers: [SendConfirmationEmailUseCase, ResendConfirmationEmailUseCase, OnUserCreatedEmailSubscriber],
  exports: [SendConfirmationEmailUseCase, ResendConfirmationEmailUseCase],
})
export class NotificationsModule { }