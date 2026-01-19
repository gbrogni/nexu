import { Injectable, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { SessionManager, SessionTokens } from '@/domain/auth/contracts/session-manager.interface';
import { EnvService } from '@/infra/env/env.service';

@Injectable({ scope: Scope.REQUEST })
export class HttpSessionManager implements SessionManager {
  constructor(
    private readonly envService: EnvService,
    @Inject(REQUEST) private readonly request: Request,
  ) { }

  private get response() {
    return this.request.res;
  }

  setTokens(tokens: SessionTokens): void {
    const isProduction: boolean = this.envService.get('NODE_ENV') === 'production';

    if (!this.response) return;
    this.response.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction,
      maxAge: 1 * 60 * 1000,
      path: '/',
    });
    this.response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
  }

  clearTokens(): void {
    if (!this.response) return;
    this.response.clearCookie('accessToken');
    this.response.clearCookie('refreshToken', { path: '/' });
  }

  getRefreshToken(): string | null {
    return this.request.cookies?.refreshToken || null;
  }
}