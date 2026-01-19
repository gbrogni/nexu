import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { AuthenticateUserUseCase } from '@/application/auth/use-cases/authenticate-user';
import { CreateAccountUseCase } from '@/application/users/use-cases/create-account';
import { AuthenticateWithGoogleUseCase } from '@/application/auth/use-cases/authenticate-with-google';
import { LogoutUseCase } from '@/application/auth/use-cases/logout';
import { RefreshAccessTokenUseCase } from '@/application/auth/use-cases/refresh-token';
import { AuthModule } from '../auth/auth.module';
import { EnvModule } from '../env/env.module';
import { LoginController } from './auth/controllers/login.controller';
import { LogoutController } from './auth/controllers/logout.controller';
import { RefreshAccessTokenController } from './auth/controllers/refresh.controller';
import { SessionManager } from '@/domain/auth/contracts/session-manager.interface';
import { HttpSessionManager } from './session/http-session-manager';
import { GetCurrentUserUseCase } from '@/application/auth/use-cases/get-current-user';
import { GetCurrentUserController } from './users/controllers/get-current-user.controller';
import { CreateAccountController } from './users/controllers/create-account.controller';
import { GoogleAuthController } from './auth/controllers/google-auth.controller';

@Module({
  imports: [
    DatabaseModule,
    CryptographyModule,
    AuthModule,
    EnvModule
  ],
  controllers: [
    LoginController,
    GoogleAuthController,
    CreateAccountController,
    GetCurrentUserController,
    LogoutController,
    RefreshAccessTokenController,
  ],
  providers: [
    AuthenticateUserUseCase,
    AuthenticateWithGoogleUseCase,
    CreateAccountUseCase,
    GetCurrentUserUseCase,
    LogoutUseCase,
    RefreshAccessTokenUseCase,
    {
      provide: SessionManager,
      useClass: HttpSessionManager,
    },
  ],
})
export class HttpModule { }