import { ApiProperty } from '@nestjs/swagger';

export class CurrentUserResponseDto {
  @ApiProperty({
    description: 'ID único do usuário',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    type: String,
  })
  id!: string;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva Santos',
    type: String,
  })
  name!: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao.silva@exemplo.com',
    type: String,
  })
  email!: string;

  @ApiProperty({
    description: 'URL da foto de perfil do usuário',
    example: 'https://exemplo.com/avatar.jpg',
    type: String,
    nullable: true,
    required: false,
  })
  avatar?: string;

  @ApiProperty({
    description: 'Data de criação da conta',
    example: '2025-01-15T10:30:00.000Z',
    type: String,
    format: 'date-time',
  })
  createdAt!: string;

  @ApiProperty({
    description: 'Data da última atualização do perfil',
    example: '2025-01-18T14:22:00.000Z',
    type: String,
    format: 'date-time',
  })
  updatedAt!: string;
}