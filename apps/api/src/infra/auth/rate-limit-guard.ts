import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class AuthRateLimitGuard extends ThrottlerGuard {
  protected async getTracker(req: any): Promise<string> {
    return req.ip + (req.body?.email || '');
  }
}