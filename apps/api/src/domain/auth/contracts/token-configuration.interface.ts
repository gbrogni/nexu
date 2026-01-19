export interface TokenConfiguration {
  accessTokenExpiryMs: number;
  refreshTokenExpiryMs: number;
  isSecureEnvironment: boolean;
}

export abstract class TokenConfigurationProvider {
  abstract getConfiguration(): TokenConfiguration;
}