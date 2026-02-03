import { Module } from '@nestjs/common';
import { EnvModule } from '../env/env.module';
import { IEmailService } from '@/domain/notifications/contracts/email-service.interface';
import { BrevoEmailService } from './brevo-email.service';

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: IEmailService,
      useClass: BrevoEmailService,
    },
  ],
  exports: [IEmailService],
})
export class EmailModule { }