export enum PaymentStatus {
  PENDING = 1,
  PAID = 2,
  REFUNDED = 3,
  CANCELLED = 4,
}

export const PaymentStatusLabel: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: 'Pendente',
  [PaymentStatus.PAID]: 'Pago',
  [PaymentStatus.REFUNDED]: 'Estornado',
  [PaymentStatus.CANCELLED]: 'Cancelado',
};