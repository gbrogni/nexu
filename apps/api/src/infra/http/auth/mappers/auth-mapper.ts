import { User } from '@/domain/accounts/entities';
import { CurrentUserResponseDto } from '../../users/dtos/current-user-response-dto';

export class AuthMapper {

  static mapToAuthResponse(user: User): CurrentUserResponseDto {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email || '',
      avatar: user.profilePicture?.getValue(),
      createdAt: user.createdAt ? user.createdAt.toISOString() : '',
      updatedAt: user.updatedAt ? user.updatedAt.toISOString() : '',
    };
  }
}