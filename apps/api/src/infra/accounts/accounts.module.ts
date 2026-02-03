import { Module } from '@nestjs/common';
import { CreateAccountController } from './controllers/create-account.controller';
import { GetCurrentUserController } from './controllers/get-current-user.controller';
import { CreateAccountUseCase } from '@/application/accounts/use-cases/create-account';
import { CryptographyModule } from '@/infra/cryptography/cryptography.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { NotificationsModule } from '@/infra/notifications/notifications.module';
import { GetCurrentUserUseCase } from '@/application/auth/use-cases/get-current-user';

@Module({
  imports: [
    DatabaseModule,
    CryptographyModule,
    NotificationsModule,
  ],
  controllers: [
    CreateAccountController,
    GetCurrentUserController,
  ],
  providers: [
    CreateAccountUseCase,
    GetCurrentUserUseCase,
  ],
  exports: [
    CreateAccountUseCase,
    GetCurrentUserUseCase,
  ],
})
export class AccountsModule {}
