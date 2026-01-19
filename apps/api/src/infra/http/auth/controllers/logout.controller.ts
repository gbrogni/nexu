import {
  BadRequestException,
  Controller,
  UnauthorizedException,
  Req,
  Delete,
  HttpCode
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { LogoutUseCase } from '@/application/auth/use-cases/logout';
import { SessionManager } from '@/domain/auth/contracts/session-manager.interface';

@ApiTags('🔐 Authentication')
@Controller('/auth')
export class LogoutController {
  constructor(
    private readonly logoutUser: LogoutUseCase,
    private readonly sessionManager: SessionManager,
  ) { }

  @Delete('session')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Fazer logout do usuário',
    description: `
      Realiza logout invalidando tokens e limpando cookies HttpOnly.
      
      **Processo:**
      1. Extrai access token do cookie HttpOnly
      2. Adiciona token à blacklist
      3. Remove todos os refresh tokens do usuário
      4. Limpa cookies HttpOnly
      
      **Segurança:**
      - Token extraído de cookie HttpOnly
      - Cookies limpos do navegador
      - Todos os dispositivos desconectados
    `,
  })
  @ApiOkResponse({
    description: 'Logout realizado com sucesso - cookies limpos'
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido ou expirado',
  })
  @ApiBadRequestResponse({
    description: 'Token não encontrado',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor',
  })
  async handle(
    @CurrentUser() user: UserPayload,
    @Req() request: Request
  ): Promise<void> {
    const token = request.cookies?.accessToken;

    if (!token) {
      throw new BadRequestException('No token provided');
    }

    const result = await this.logoutUser.execute({
      accessToken: token,
      userId: user.sub,
    });

    if (result.isLeft()) {
      const error: ResourceNotFoundError = result.value;
      if (error.constructor === ResourceNotFoundError) {
        throw new UnauthorizedException(error.message);
      } else {
        throw new BadRequestException(error.message);
      }
    }

    this.sessionManager.clearTokens();
  }
}