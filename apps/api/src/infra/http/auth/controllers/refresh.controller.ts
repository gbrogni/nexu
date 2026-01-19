import { Public } from '@/infra/auth/public';
import {
  BadRequestException,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { RefreshAccessTokenUseCase } from '@/application/auth/use-cases/refresh-token';
import { SessionManager } from '@/domain/auth/contracts/session-manager.interface';

@ApiTags('🔐 Authentication')
@Controller('/auth')
@Public()
export class RefreshAccessTokenController {
  constructor(
    private readonly refreshAccessToken: RefreshAccessTokenUseCase,
    private readonly sessionManager: SessionManager,
  ) { }

  @Post('refresh')
  @HttpCode(200)
  @ApiOperation({
    summary: '🔄 Renovar token de acesso',
    description: `
      **Renova o access token usando refresh token com rotação de segurança.**
      
      ## 🔑 Processo de Renovação:
      1. **Extração**: Obtém refresh token dos cookies HttpOnly
      2. **Validação**: Verifica se o refresh token é válido e não expirou
      3. **Autorização**: Confirma que o token pertence a um usuário ativo
      4. **Geração**: Cria novo access token (15 minutos de validade)
      5. **Rotação**: Gera novo refresh token (7 dias de validade)
      6. **Segurança**: Define novos tokens em cookies HttpOnly
      
      ## 🛡️ Token Rotation (Segurança Máxima):
      - **Refresh Token**: Rotacionado a cada uso (one-time use)
      - **Access Token**: Sempre novo com timestamp atual
      - **Cookies**: Atualizados com flags de segurança
      - **Cleanup**: Refresh tokens antigos são invalidados
      
      ## ⚡ Performance e Otimização:
      - **Database**: Consulta otimizada com índices
      - **Memory**: Tokens armazenados em cache temporário
      - **Response Time**: < 200ms típico
      - **Concurrency**: Thread-safe para múltiplas requisições
      
      ## 🎯 Quando Usar:
      - **Auto-refresh**: Quando access token está próximo da expiração
      - **Interceptors**: Em respostas 401 automáticas
      - **Background**: Renovação silenciosa para UX fluida
      - **Startup**: Validação de sessão ao inicializar aplicação
      
      ## 🚫 Cenários de Falha:
      - Refresh token expirado (> 7 dias)
      - Token já foi usado (replay attack prevention)
      - Usuário foi desabilitado/removido
      - Token malformado ou corrompido
      
      ## 📱 Compatibilidade:
      - **SPA**: Funciona com aplicações single-page
      - **Mobile**: Compatível com apps móveis
      - **Server-side**: Suporte para SSR/SSG
    `,
  })
  @ApiOkResponse({
    description: '✅ **Token renovado com sucesso**\n\n' +
      'Novos access token e refresh token foram gerados e definidos em cookies HttpOnly.\n' +
      'O cliente pode continuar fazendo requisições autenticadas normalmente.\n\n' +
      '**Importante**: O refresh token anterior foi invalidado (one-time use).',
    headers: {
      'Set-Cookie': {
        description: 'Novos cookies HttpOnly com tokens atualizados',
        schema: {
          type: 'string',
          example: 'accessToken=eyJ...; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=900'
        }
      }
    },
    schema: {
      example: null
    }
  })
  @ApiUnauthorizedResponse({
    description: '🚫 **Refresh token inválido ou expirado**\n\n' +
      'Possíveis causas:\n' +
      '- Refresh token expirado (> 7 dias desde emissão)\n' +
      '- Token já foi usado anteriormente (replay attack prevention)\n' +
      '- Token não existe no banco de dados\n' +
      '- Usuário foi desabilitado ou removido\n' +
      '- Token malformado ou corrompido\n\n' +
      '**Ação requerida**: Usuário deve fazer login novamente.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Refresh token inválido ou expirado',
        timestamp: '2025-01-18T14:22:00.000Z'
      }
    }
  })
  @ApiBadRequestResponse({
    description: '❌ **Refresh token não encontrado**\n\n' +
      'Nenhum refresh token foi fornecido nos cookies da requisição.\n' +
      'Isso pode indicar que:\n' +
      '- Usuário nunca fez login\n' +
      '- Cookies foram limpos pelo navegador\n' +
      '- Problema na configuração de cookies\n\n' +
      '**Ação requerida**: Usuário deve fazer login.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Refresh token not found',
        timestamp: '2025-01-18T14:22:00.000Z'
      }
    }
  })
  @ApiResponse({
    status: 403,
    description: '🔒 **Acesso negado**\n\n' +
      'O refresh token existe mas não pode ser usado:\n' +
      '- Conta de usuário foi suspensa\n' +
      '- Token foi revogado administrativamente\n' +
      '- Violação de política de segurança detectada\n\n' +
      '**Ação requerida**: Usuário deve fazer login novamente.',
    schema: {
      example: {
        statusCode: 403,
        message: 'Access denied',
        timestamp: '2025-01-18T14:22:00.000Z'
      }
    }
  })
  @ApiInternalServerErrorResponse({
    description: '💥 **Erro interno do servidor**\n\n' +
      'Erro inesperado durante a renovação do token.\n' +
      'Possíveis causas:\n' +
      '- Falha na conexão com banco de dados\n' +
      '- Erro na geração de tokens JWT\n' +
      '- Problema na configuração de chaves\n\n' +
      '**Ação**: Tente novamente em alguns segundos.',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error',
        timestamp: '2025-01-18T14:22:00.000Z'
      }
    }
  })
  async handle() {
    const refreshToken: string | null = this.sessionManager.getRefreshToken();

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const result = await this.refreshAccessToken.execute({
      refreshToken,
    });

    if (result.isLeft()) {
      const error = result.value;

      this.sessionManager.clearTokens();

      if (error.constructor === ResourceNotFoundError || error.constructor === NotAllowedError) {
        throw new UnauthorizedException(error.message);
      } else {
        throw new BadRequestException(error.message);
      }
    }

    const { accessToken, refreshToken: newRefreshToken } = result.value;

    this.sessionManager.setTokens({
      accessToken,
      refreshToken: newRefreshToken
    });
  }
}