export enum UserStatus {
  ACTIVE = 1,
  INACTIVE = 2,
  PENDING_CONFIRMATION = 3,
}

export const UserStatusLabel: Record<UserStatus, string> = {
  [UserStatus.ACTIVE]: 'Ativo',
  [UserStatus.INACTIVE]: 'Inativo',
  [UserStatus.PENDING_CONFIRMATION]: 'Pendente de Confirmação',
};