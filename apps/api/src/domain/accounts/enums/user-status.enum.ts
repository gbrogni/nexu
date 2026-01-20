export enum UserStatus {
  ACTIVE = 1,
  INACTIVE = 2,
}

export const UserStatusLabel: Record<UserStatus, string> = {
  [UserStatus.ACTIVE]: 'Ativo',
  [UserStatus.INACTIVE]: 'Inativo',
};