import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiConflictResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { z } from 'zod';

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { Public } from '@/infra/auth/public';
import { UserAlreadyExistsError } from '@/core/errors/user-already-exists-error';
import { CreateAccountUseCase } from '@/application/accounts/use-cases/create-account';
import { CreateAccountDto } from '../dtos/create-account-dto';

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@ApiTags('👥 Users')
@Controller('users')
@Public()
export class CreateAccountController {
  constructor(private readonly createAccountUseCase: CreateAccountUseCase) { }

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  @ApiOperation({
    summary: 'Criar nova conta de usuário',
    description: `
      Cria uma nova conta de usuário no sistema.
      
      **Requisitos:**
      - Nome: string não vazia
      - Email: formato válido e único no sistema
      - Senha: string não vazia
      
      **Características:**
      - Rota pública (não requer autenticação)
      - Senha automaticamente criptografada
      - Validação automática de duplicidade de email
    `,
  })
  @ApiBody({
    type: CreateAccountDto,
    description: 'Dados necessários para criação da conta'
  })
  @ApiCreatedResponse({
    description: 'Conta criada com sucesso (sem conteúdo no corpo da resposta)',
  })
  @ApiConflictResponse({
    description: 'Email já está em uso por outro usuário',
  })
  @ApiBadRequestResponse({
    description: 'Dados de entrada inválidos',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor',
  })
  async handle(@Body() body: CreateAccountBodySchema): Promise<void> {
    const { name, email, password } = body;

    const result = await this.createAccountUseCase.execute({
      name,
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      if (error.constructor === UserAlreadyExistsError) {
        throw new ConflictException(error.message);
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }
}