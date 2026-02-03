import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { EnvModule } from '@/infra/env/env.module';
import { EnvService } from '@/infra/env/env.service';
import { CryptographyModule } from '@/infra/cryptography/cryptography.module';
import { JwtStrategy } from './jwt.strategy';
import { GoogleStrategy } from './google-auth/google-oauth.strategy';
import { TokenBlacklistService } from '@/application/auth/services/token-blacklist.service';
import { TokenBlacklistValidator } from './validators/token-validator';
import { TokenValidator } from '@/domain/auth/contracts/token-validator.interface';
import { TokenConfigurationProvider } from '@/domain/auth/contracts/token-configuration.interface';
import { EnvironmentTokenConfigurationProvider } from './providers/environment-token-configuration.provider';
import { AuthenticateUserUseCase } from '@/application/auth/use-cases/authenticate-user';
import { AuthenticateWithGoogleUseCase } from '@/application/auth/use-cases/authenticate-with-google';
import { ConfirmEmailUseCase } from '@/application/auth/use-cases/confirm-email';
import { GetCurrentUserUseCase } from '@/application/auth/use-cases/get-current-user';
import { LogoutUseCase } from '@/application/auth/use-cases/logout';
import { RefreshAccessTokenUseCase } from '@/application/auth/use-cases/refresh-token';
import { HttpSessionManager } from '../http/session/http-session-manager';
import { SESSION_MANAGER } from '@/domain/auth/contracts/session-manager.token';
import { ConfirmEmailController } from './controllers/confirm-email.controller';
import { GoogleAuthController } from './controllers/google-auth.controller';
import { LoginController } from './controllers/login.controller';
import { LogoutController } from './controllers/logout.controller';
import { RefreshAccessTokenController } from './controllers/refresh.controller';
import { ResendConfirmationEmailController } from './controllers/resend-confirmation-email.controller';
import { ResendConfirmationEmailUseCase } from '@/application/notifications/use-cases/resend-confirmation-email';

@Module({
  imports: [
    PassportModule,
    EnvModule,
    CryptographyModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory(env: EnvService) {
        const privateKey: string = env.get('JWT_PRIVATE_KEY');
        const publicKey: string = env.get('JWT_PUBLIC_KEY');

        return {
          signOptions: {
            algorithm: 'RS256',
            expiresIn: '15m',
          },
          privateKey: Buffer.from(privateKey, 'base64'),
          publicKey: Buffer.from(publicKey, 'base64'),
          verifyOptions: { maxAge: '7d' },
        };
      },
    }),
  ],
  controllers: [
    LoginController,
    GoogleAuthController,
    RefreshAccessTokenController,
    ConfirmEmailController,
    LogoutController,
  ],
  providers: [
    JwtStrategy,
    GoogleStrategy,
    TokenBlacklistService,
    {
      provide: TokenValidator,
      useClass: TokenBlacklistValidator,
    },
    {
      provide: TokenConfigurationProvider,
      useClass: EnvironmentTokenConfigurationProvider,
    },
    AuthenticateUserUseCase,
    AuthenticateWithGoogleUseCase,
    GetCurrentUserUseCase,
    LogoutUseCase,
    RefreshAccessTokenUseCase,
    ConfirmEmailUseCase,
    {
      provide: SESSION_MANAGER,
      useClass: HttpSessionManager,
    },
  ],
  exports: [
    AuthenticateUserUseCase,
    AuthenticateWithGoogleUseCase,
    GetCurrentUserUseCase,
    LogoutUseCase,
    RefreshAccessTokenUseCase,
    ConfirmEmailUseCase,
    TokenValidator,
    TokenConfigurationProvider,
    SESSION_MANAGER,
  ],
})
export class AuthModule { }