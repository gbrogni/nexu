import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { users } from '../../schema';
import { User } from '@/domain/accounts/entities';
import { AuthProvider, UserRole, UserStatus } from '@/domain/accounts/enums';
import { ProfilePictureUrl } from '@/domain/accounts/value-objects';

export class DrizzleUserMapper {
  static toDomain(raw: typeof users.$inferSelect): User {
    return User.create({
      companyId: new UniqueEntityID(raw.companyId),
      name: raw.name,
      email: raw.email ?? undefined,
      phone: raw.phone ?? undefined,
      role: raw.role as UserRole,
      status: raw.status as UserStatus,
      passwordHash: raw.passwordHash ?? undefined,
      authProvider: raw.authProvider as AuthProvider,
      authProviderId: raw.authProviderId ?? undefined,
      profilePicture: raw.profilePictureUrl ? ProfilePictureUrl.create(raw.profilePictureUrl) : undefined,
      lastLoginAt: raw.lastLoginAt ?? undefined,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }, new UniqueEntityID(raw.id));
  }

  static toDrizzle(user: User): typeof users.$inferInsert {
    return {
      id: user.id.toString(),
      companyId: user.companyId.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      passwordHash: user.passwordHash,
      authProvider: user.authProvider,
      authProviderId: user.authProviderId,
      profilePictureUrl: user.profilePicture?.getValue(),
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}