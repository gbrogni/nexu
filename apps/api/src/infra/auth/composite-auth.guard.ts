import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from './public';
import { TokenValidator } from '../../domain/auth/contracts/token-validator.interface';

@Injectable()
export class CompositeAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenValidator: TokenValidator,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.accessToken;
    
    if (!token) {
      throw new UnauthorizedException('Access token not found');
    }

    request.headers.authorization = `Bearer ${token}`;

    const jwtResult = await super.canActivate(context);
    if (!jwtResult) {
      return false;
    }

    if (!(await this.tokenValidator.isTokenValid(token))) {
      throw new UnauthorizedException('Token has been revoked');
    }

    return true;
  }
}