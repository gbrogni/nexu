import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva',
  })
  name!: string;

  @ApiProperty({
    description: 'Email válido do usuário',
    example: 'joao.silva@email.com',
    format: 'email',
  })
  email!: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'minhasenha123',
  })
  password!: string;
}