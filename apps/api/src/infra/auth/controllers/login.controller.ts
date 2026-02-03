import z from 'zod';
import { Public } from '@/infra/auth/public';
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { WrongCredentialsError } from '@/core/errors/wrong-credentials-error';
import { AuthenticateUserUseCase } from '@/application/auth/use-cases/authenticate-user';
import { AuthenticateDto } from '../dtos/authenticate-dto';
import { Throttle } from '@nestjs/throttler';
import { SessionManager } from '@/domain/auth/contracts/session-manager.interface';
import { AuthMapper } from '../mappers/auth-mapper';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';

const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type LoginBodySchema = z.infer<typeof loginBodySchema>;

@ApiTags('🔐 Authentication')
@Controller('/auth')
@Throttle({ default: { limit: 5, ttl: 60 } })
@Public()
export class LoginController {
  constructor(
    private readonly authenticateUser: AuthenticateUserUseCase,
    private readonly sessionManager: SessionManager,
  ) { }

  @Post('login')
  @UsePipes(new ZodValidationPipe(loginBodySchema))
  @ApiOperation({
    summary: 'Autenticar usuário',
    description: `
      Autentica um usuário existente no sistema e define cookies HttpOnly seguros.
      
      **Processo:**
      1. Valida o formato do email e presença da senha
      2. Verifica se o usuário existe no sistema
      3. Compara a senha fornecida com a senha criptografada
      4. Gera tokens JWT e define cookies HttpOnly
      
      **Segurança:**
      - Tokens armazenados em cookies HttpOnly (não acessíveis via JavaScript)
      - Flags Secure e SameSite para proteção adicional
      - Access token com vida curta (15 minutos)
      - Refresh token com vida longa (7 dias)
      
      **Requisitos:**
      - Email: formato válido e deve estar cadastrado
      - Senha: deve corresponder à senha cadastrada
    `,
  })
  @ApiBody({
    type: AuthenticateDto,
    description: 'Credenciais de acesso do usuário',
    examples: {
      exemplo1: {
        summary: 'Credenciais válidas',
        description: 'Exemplo de login com credenciais corretas',
        value: {
          email: 'joao.silva@email.com',
          password: 'minhasenha123'
        }
      }
    }
  })
  @ApiOkResponse({
    description: 'Autenticação realizada com sucesso - tokens definidos em cookies HttpOnly'
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciais inválidas (email não encontrado ou senha incorreta)',
  })
  @ApiBadRequestResponse({
    description: 'Dados de entrada inválidos ou malformados',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor',
  })
  async handle(
    @Body() body: LoginBodySchema,
  ) {
    const { email, password } = body;

    const result = await this.authenticateUser.execute({
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;
      if (error.constructor === WrongCredentialsError) {
        throw new UnauthorizedException(error.message);
      } else {
        throw new BadRequestException(error.message);
      }
    }

    const { accessToken, refreshToken, user } = result.value;

    this.sessionManager.setTokens({ accessToken, refreshToken });

    return AuthMapper.mapToAuthResponse(user);
  }
}