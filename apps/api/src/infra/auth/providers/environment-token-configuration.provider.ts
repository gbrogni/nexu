import { TokenConfiguration, TokenConfigurationProvider } from '@/domain/auth/contracts/token-configuration.interface';
import { EnvService } from '@/infra/env/env.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EnvironmentTokenConfigurationProvider implements TokenConfigurationProvider {
  constructor(private readonly envService: EnvService) {}

  getConfiguration(): TokenConfiguration {
    return {
      accessTokenExpiryMs: 15 * 60 * 1000,
      refreshTokenExpiryMs: 7 * 24 * 60 * 60 * 1000,
      isSecureEnvironment: this.envService.get('NODE_ENV') === 'production',
    };
  }
}
