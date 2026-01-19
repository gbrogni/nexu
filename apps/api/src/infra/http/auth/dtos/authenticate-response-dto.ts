import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user-response-dto';

export class AuthenticateResponseDto {
  @ApiProperty()
  success!: boolean;

  @ApiProperty()
  message!: string;

  @ApiProperty({ type: UserResponseDto })
  user!: UserResponseDto;
}