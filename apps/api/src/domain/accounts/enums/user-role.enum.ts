export enum UserRole {
  ADMIN = 1,
  OPERATOR = 2,
  COURIER = 3,
}

export const UserRoleLabel: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Admin/Lojista',
  [UserRole.OPERATOR]: 'Operador',
  [UserRole.COURIER]: 'Entregador',
};