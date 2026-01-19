import { ApiProperty } from '@nestjs/swagger';

export class LogoutResponseDto {
  @ApiProperty({
    description: 'Mensagem de confirmação do logout',
    example: 'Logout successful',
  })
  message!: string;
}