import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { User } from '@/domain/users/entities/user';
import { UsersRepository } from '@/domain/users/repositories/users-repository';
import { Injectable } from '@nestjs/common';

interface GetCurrentUserUseCaseRequest {
  userId: string;
}

type GetCurrentUserUseCaseResponse = Either<ResourceNotFoundError, { user: User; }>;

@Injectable()
export class GetCurrentUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
  ) { }

  async execute({ userId }: GetCurrentUserUseCaseRequest): Promise<GetCurrentUserUseCaseResponse> {
    const user: User | null = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    return right({ user });
  }
}