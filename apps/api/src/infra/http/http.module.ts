import { SessionManager } from '@/domain/auth/contracts/session-manager.interface';
import { Global, Module } from '@nestjs/common';
import { ZodValidationPipe } from './pipes/zod-validation-pipe';
import { HttpSessionManager } from './session/http-session-manager';

@Global()
@Module({
  providers: [
    {
      provide: SessionManager,
      useClass: HttpSessionManager,
    },
    ZodValidationPipe,
  ],
  exports: [SessionManager, ZodValidationPipe],
})
export class HttpModule { }