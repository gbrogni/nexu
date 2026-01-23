import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { users } from '../../schema';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { BaseRepository } from '../../base-repository';
import { UsersRepository } from '@/domain/accounts/repositories/users-repository';
import { DatabaseService } from '../../database.service';
import { User } from '@/domain/accounts/entities';
import { DrizzleUserMapper } from '../mappers/drizzle-user-mapper';

@Injectable()
export class DrizzleUsersRepository extends BaseRepository implements UsersRepository {
  constructor(protected readonly dbService: DatabaseService) {
    super(dbService);
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db.select().from(users).where(eq(users.email, email)).limit(1);

    if (result.length === 0) {
      return null;
    }

    return DrizzleUserMapper.toDomain(result[0]);
  }

  async findById(id: string): Promise<User | null> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);

    if (result.length === 0) {
      return null;
    }

    return DrizzleUserMapper.toDomain(result[0]);
  }

  async create(user: User): Promise<void> {
    const data = DrizzleUserMapper.toDrizzle(user);
    await this.db.insert(users).values(data);
  }
}