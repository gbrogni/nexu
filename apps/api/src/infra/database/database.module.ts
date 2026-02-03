import { Global, Module } from '@nestjs/common';
import { EnvModule } from '../env/env.module';
import { DatabaseService } from './database.service';
import { DrizzleUsersRepository } from './accounts/repositories/drizzle-users-repository';
import { UsersRepository } from '@/domain/accounts/repositories/users-repository';
import { RefreshTokenRepository } from '@/domain/auth/repositories/refresh-token-repository';
import { DrizzleRefreshTokenRepository } from './auth/repositories/drizzle-refresh-token-repository';
import { TokenBlacklistRepository } from '@/domain/auth/repositories/token-blacklist-repository';
import { DrizzleTokenBlacklistRepository } from './auth/repositories/drizzle-token-blacklist-repository';
import { EmailConfirmationTokenRepository } from '@/domain/auth/repositories/email-confirmation-token-repository';
import { DrizzleEmailConfirmationTokenRepository } from './auth/repositories/drizzle-email-confirmation-token-repository';

@Global()
@Module({
  imports: [EnvModule],
  providers: [
    DatabaseService,
    {
      provide: UsersRepository,
      useClass: DrizzleUsersRepository,
    },
    {
      provide: RefreshTokenRepository,
      useClass: DrizzleRefreshTokenRepository,
    },
    {
      provide: TokenBlacklistRepository,
      useClass: DrizzleTokenBlacklistRepository,
    },
    {
      provide: EmailConfirmationTokenRepository,
      useClass: DrizzleEmailConfirmationTokenRepository,
    },
  ],
  exports: [
    DatabaseService,
    UsersRepository,
    RefreshTokenRepository,
    TokenBlacklistRepository,
    EmailConfirmationTokenRepository,
  ],
})
export class DatabaseModule { }