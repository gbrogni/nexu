import { Module } from '@nestjs/common';
import { EnvModule } from '@/infra/env/env.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { AuthModule } from '@/infra/auth/auth.module';
import { AuditModule } from '@/infra/audit/audit.module';
import { CryptographyModule } from '@/infra/cryptography/cryptography.module';
import { EmailModule } from '@/infra/email/email.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CompositeAuthGuard } from '@/infra/auth/composite-auth.guard';
import { ThrottlerGuard } from '@nestjs/throttler';
import { TokenBlacklistService } from '@/application/auth/services/token-blacklist.service';
import { AccountsModule } from './accounts/accounts.module';
import { NotificationsModule } from './notifications/notifications.module';
import { HttpModule } from './http/http.module';

@Module({
  imports: [
    EnvModule,
    DatabaseModule,
    CryptographyModule,
    EmailModule,
    ThrottlerModule.forRoot({
      throttlers: [{
        ttl: 60,
        limit: 10,
      }]
    }),
    HttpModule,
    AuthModule,
    AccountsModule,
    NotificationsModule,
    AuditModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CompositeAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    TokenBlacklistService,
  ],
})
export class AppModule { }