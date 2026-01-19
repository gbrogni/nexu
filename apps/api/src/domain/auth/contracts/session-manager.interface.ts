export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
}

export abstract class SessionManager {
  abstract setTokens(tokens: SessionTokens): void;
  abstract clearTokens(): void;
  abstract getRefreshToken(): string | null;
}