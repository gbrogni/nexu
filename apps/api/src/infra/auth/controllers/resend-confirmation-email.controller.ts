import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { z } from 'zod';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { Public } from '@/infra/auth/public';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { Throttle } from '@nestjs/throttler';
import { ResendConfirmationEmailUseCase } from '@/application/notifications/use-cases/resend-confirmation-email';

// Schema de validação
const resendConfirmationEmailSchema = z.object({
  email: z.string().email('Invalid email format'),
});

type ResendConfirmationEmailDTO = z.infer<typeof resendConfirmationEmailSchema>;

// Response DTO para Swagger
class ResendConfirmationEmailResponseDto {
  message!: string;
  expiresAt!: Date;
}

@ApiTags('Authentication')
@Controller('auth')
export class ResendConfirmationEmailController {
  private readonly logger = new Logger(ResendConfirmationEmailController.name);

  constructor(
    private readonly resendConfirmationEmailUseCase: ResendConfirmationEmailUseCase,
  ) {}

  @Post('resend-confirmation')
  @Public()
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 requests por minuto
  @ApiOperation({
    summary: 'Reenviar email de confirmação',
    description: 'Reenvia o email de confirmação para o endereço fornecido. Limitado a 3 tentativas por minuto para prevenir abuso.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
          example: 'usuario@exemplo.com',
          description: 'Email do usuário que deseja reenviar confirmação',
        },
      },
      required: ['email'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Email reenviado com sucesso',
    type: ResendConfirmationEmailResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Email inválido ou usuário já confirmado',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  @ApiResponse({
    status: 429,
    description: 'Muitas tentativas. Aguarde antes de tentar novamente.',
  })
  async handle(
    @Body(new ZodValidationPipe(resendConfirmationEmailSchema))
    body: ResendConfirmationEmailDTO,
  ) {
    const { email } = body;

    const result = await this.resendConfirmationEmailUseCase.execute({ email });

    if (result.isLeft()) {
      const error = result.value;

      if (error instanceof ResourceNotFoundError) {
        // ⚠️ Segurança: Não revelar se email existe
        throw new NotFoundException('User not found or already confirmed');
      }

      if (error instanceof NotAllowedError) {
        throw new BadRequestException(error.message);
      }

      throw new BadRequestException('Failed to resend confirmation email');
    }

    this.logger.log(`Confirmation email resent to: ${email}`);

    return {
      message: result.value.message,
      expiresAt: result.value.expiresAt,
    };
  }
}