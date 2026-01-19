import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { HashGenerator } from '@/domain/cryptography/hash-generator';
import { UserAlreadyExistsError } from '@/core/errors/user-already-exists-error';
import { UsersRepository } from '@/domain/users/repositories/users-repository';
import { User } from '@/domain/users/entities/user';

interface CreateAccountUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

type CreateAccountUseCaseResponse = Either<UserAlreadyExistsError, { user: User; }>;

@Injectable()
export class CreateAccountUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashGenerator: HashGenerator,
  ) { }

  async execute({
    name,
    email,
    password,
  }: CreateAccountUseCaseRequest): Promise<CreateAccountUseCaseResponse> {
    const userWithSameEmail: User | null = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      return left(new UserAlreadyExistsError(email));
    }

    const hashedPassword: string = await this.hashGenerator.hash(password);

    const user = User.create({
      name,
      email,
      password: hashedPassword,
      authProvider: 'LOCAL'
    });

    await this.usersRepository.create(user);

    return right({
      user: user,
    });
  }
}