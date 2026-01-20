export enum CheckoutSessionStatus {
  ACTIVE = 1,
  EXPIRED = 2,
  USED = 3,
}

export const CheckoutSessionStatusLabel: Record<CheckoutSessionStatus, string> = {
  [CheckoutSessionStatus.ACTIVE]: 'Ativa',
  [CheckoutSessionStatus.EXPIRED]: 'Expirada',
  [CheckoutSessionStatus.USED]: 'Usada',
};