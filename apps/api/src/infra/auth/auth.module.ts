import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { EnvService } from '../env/env.service';
import { EnvModule } from '../env/env.module';
import { GoogleStrategy } from './google-auth/google-oauth.strategy';
import { GoogleOauthGuard } from './google-auth/google-oauth.guard';
import { AuthRateLimitGuard } from './rate-limit-guard';
import { ThrottlerGuard } from '@nestjs/throttler';
import { CompositeAuthGuard } from './composite-auth.guard';
import { TokenValidator } from '@/domain/auth/contracts/token-validator.interface';
import { TokenBlacklistValidator } from './validators/token-validator';
import { DatabaseModule } from '../database/database.module';
import { TokenBlacklistService } from '@/application/auth/services/token-blacklist.service';
import { TokenConfigurationProvider } from '@/domain/auth/contracts/token-configuration.interface';
import { EnvironmentTokenConfigurationProvider } from './providers/environment-token-configuration.provider';

@Module({
  imports: [
    PassportModule,
    DatabaseModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      global: true,
      useFactory(env: EnvService) {
        const privateKey: string = env.get('JWT_PRIVATE_KEY');
        const publicKey: string = env.get('JWT_PUBLIC_KEY');

        return {
          signOptions: {
            algorithm: 'RS256',
            expiresIn: '15m', // Access token de 15 minutos
          },
          privateKey: Buffer.from(privateKey, 'base64'),
          publicKey: Buffer.from(publicKey, 'base64'),
          verifyOptions: { maxAge: '7d' },
        };
      },
    }),
  ],
  providers: [
    JwtStrategy,
    EnvService,
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
    {
      provide: APP_GUARD,
      useClass: CompositeAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    GoogleOauthGuard,
    AuthRateLimitGuard,
  ],
  exports: [
    TokenValidator,
    TokenConfigurationProvider,
  ],
})
export class AuthModule { }