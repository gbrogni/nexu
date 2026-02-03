import { Controller, Get, UnauthorizedException } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { GetCurrentUserUseCase } from '@/application/auth/use-cases/get-current-user';
import { CurrentUserResponseDto } from '../dtos/current-user-response-dto';
import { AuthMapper } from '@/infra/auth/mappers/auth-mapper';

@ApiTags('👥 Users')
@Controller('users')
@ApiBearerAuth('HttpOnly Cookies')
export class GetCurrentUserController {
  constructor(
    private readonly getCurrentUser: GetCurrentUserUseCase,
  ) { }

  @Get('me')
  @ApiOperation({
    summary: '👤 Obter dados do usuário autenticado',
    description: `
      **Retorna os dados completos do usuário atualmente autenticado.**
      
      ## 🔍 Funcionalidade:
      Este endpoint fornece acesso aos dados do perfil do usuário autenticado,
      incluindo informações pessoais e metadados da conta.
      
      ## 🔒 Autenticação Requerida:
      - **Access Token**: Válido em cookie HttpOnly
      - **Validade**: Token deve estar dentro do prazo (15 minutos)
      - **Blacklist**: Token não deve estar na lista de revogados
      
      ## 📊 Dados Retornados:
      - **Identificação**: ID único do usuário
      - **Pessoais**: Nome completo e email
      - **Avatar**: URL da foto de perfil (se disponível)
      - **Timestamps**: Datas de criação e última atualização
      
      ## 🚀 Performance:
      - **Cache**: Dados podem ser cacheados pelo cliente por até 5 minutos
      - **Response Time**: < 200ms típico
      - **Database**: Consulta otimizada com índices
      
      ## 🎯 Casos de Uso:
      - Exibição do perfil do usuário
      - Validação de sessão ativa
      - Preenchimento de formulários
      - Sincronização de dados do cliente
      
      ## 🔄 Auto-refresh:
      Se o token estiver próximo do vencimento, considere fazer refresh
      automaticamente antes de usar este endpoint.
    `,
  })
  @ApiOkResponse({
    description: '✅ **Dados do usuário retornados com sucesso**\n\n' +
      'Informações completas do perfil do usuário autenticado.\n' +
      'Dados são atuais e refletem o estado mais recente da conta.',
    type: CurrentUserResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: '🚫 **Token de acesso inválido ou expirado**\n\n' +
      'Possíveis causas:\n' +
      '- Access token não fornecido nos cookies\n' +
      '- Token expirado (> 15 minutos desde emissão)\n' +
      '- Token na blacklist (logout realizado)\n' +
      '- Token malformado ou corrompido\n' +
      '- Chave de verificação alterada',
    schema: {
      example: {
        statusCode: 401,
        message: 'Token de acesso inválido ou expirado',
        timestamp: '2025-01-18T14:22:00.000Z'
      }
    }
  })
  @ApiInternalServerErrorResponse({
    description: '💥 **Erro interno do servidor**\n\n' +
      'Erro inesperado ao buscar dados do usuário.\n' +
      'Possíveis causas: falha no banco de dados, erro de deserialização.',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error',
        timestamp: '2025-01-18T14:22:00.000Z'
      }
    }
  })
  async handle(@CurrentUser() currentUser: UserPayload): Promise<CurrentUserResponseDto> {
    const result = await this.getCurrentUser.execute({
      userId: currentUser.sub,
    });

    if (result.isLeft()) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const { user } = result.value;

    return AuthMapper.mapToAuthResponse(user);
  }
}