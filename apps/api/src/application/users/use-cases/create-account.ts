import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { HashGenerator } from '@/domain/cryptography/hash-generator';
import { AuthProvider, UserRole, UserStatus } from '@/domain/accounts/enums';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { UserAlreadyExistsError } from '@/core/errors/user-already-exists-error';
import { UsersRepository } from '@/domain/accounts/repositories/users-repository';
import { User } from '@/domain/accounts/entities';

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
      passwordHash: hashedPassword,
      authProvider: AuthProvider.LOCAL,
      companyId: new UniqueEntityID(),
      role: UserRole.OPERATOR,
      status: UserStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.usersRepository.create(user);

    return right({
      user: user,
    });
  }
}