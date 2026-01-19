import { ApiProperty } from '@nestjs/swagger';

export class AuthenticateDto {
  @ApiProperty({
    description: 'Email do usuário',
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