import {
  Controller,
  Get,
  Query,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  Logger,
  Redirect,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Public } from '@/infra/auth/public';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { EnvService } from '@/infra/env/env.service';
import { ConfirmEmailUseCase } from '@/application/auth/use-cases/confirm-email';

@ApiTags('Authentication')
@Controller('auth')
export class ConfirmEmailController {
  private readonly logger = new Logger(ConfirmEmailController.name);

  constructor(
    private readonly confirmEmailUseCase: ConfirmEmailUseCase,
    private readonly envService: EnvService,
  ) { }

  @Get('confirm-email')
  @Public()
  @HttpCode(HttpStatus.OK)
  @Redirect()
  @ApiOperation({
    summary: 'Confirmar email do usuário',
    description: 'Endpoint público que valida o token de confirmação e ativa a conta do usuário. Redireciona para o frontend após sucesso ou erro.',
  })
  @ApiQuery({
    name: 'token',
    description: 'Token de confirmação enviado por email',
    required: true,
    type: String,
    example: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
  })
  @ApiResponse({
    status: 200,
    description: 'Email confirmado com sucesso. Redireciona para /auth/login?confirmed=true',
  })
  @ApiResponse({
    status: 400,
    description: 'Token inválido ou ausente',
  })
  @ApiResponse({
    status: 404,
    description: 'Token não encontrado ou já expirado',
  })
  async handle(@Query('token') token: string) {
    const frontendUrl = this.envService.get('FRONTEND_URL');

    if (!token) {
      this.logger.warn('Confirmation attempt without token');
      return {
        url: `${frontendUrl}/auth/login?error=missing_token`,
        statusCode: HttpStatus.TEMPORARY_REDIRECT,
      };
    }

    const result = await this.confirmEmailUseCase.execute({ token });

    if (result.isLeft()) {
      const error = result.value;

      if (error instanceof ResourceNotFoundError) {
        this.logger.warn(`Token not found: ${token.substring(0, 10)}...`);
        return {
          url: `${frontendUrl}/auth/login?error=invalid_token`,
          statusCode: HttpStatus.TEMPORARY_REDIRECT,
        };
      }

      if (error instanceof NotAllowedError) {
        this.logger.warn(`Token expired or already used: ${token.substring(0, 10)}...`);
        return {
          url: `${frontendUrl}/auth/login?error=expired_token`,
          statusCode: HttpStatus.TEMPORARY_REDIRECT,
        };
      }

      this.logger.error('Unexpected error in email confirmation', error);
      return {
        url: `${frontendUrl}/auth/login?error=confirmation_failed`,
        statusCode: HttpStatus.TEMPORARY_REDIRECT,
      };
    }

    const { user } = result.value;
    this.logger.log(`Email confirmed successfully for user: ${user.email}`);

    return {
      url: `${frontendUrl}/auth/login?confirmed=true`,
      statusCode: HttpStatus.TEMPORARY_REDIRECT,
    };
  }
}