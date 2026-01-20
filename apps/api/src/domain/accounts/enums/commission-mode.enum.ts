export enum CommissionMode {
  FIXED_PER_DELIVERY = 1,
  PERCENTAGE_OF_ORDER = 2,
}

export const CommissionModeLabel: Record<CommissionMode, string> = {
  [CommissionMode.FIXED_PER_DELIVERY]: 'Valor fixo por entrega',
  [CommissionMode.PERCENTAGE_OF_ORDER]: 'Percentual sobre pedido',
};