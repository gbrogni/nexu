export enum PaymentMethod {
  PIX = 1,
  CASH = 2,
  CARD_ON_DELIVERY = 3,
}

export const PaymentMethodLabel: Record<PaymentMethod, string> = {
  [PaymentMethod.PIX]: 'Pix',
  [PaymentMethod.CASH]: 'Dinheiro',
  [PaymentMethod.CARD_ON_DELIVERY]: 'Cartão na entrega',
};