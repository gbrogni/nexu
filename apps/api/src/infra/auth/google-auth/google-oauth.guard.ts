import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleOauthGuard extends AuthGuard('google') {
  getAuthenticateOptions() {
    return {
      scope: ['profile', 'email'],
      prompt: 'select_account',
    };
  }
}