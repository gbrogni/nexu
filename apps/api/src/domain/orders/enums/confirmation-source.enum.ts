export enum ConfirmationSource {
  MERCHANT = 1,
  COURIER = 2,
}

export const ConfirmationSourceLabel: Record<ConfirmationSource, string> = {
  [ConfirmationSource.MERCHANT]: 'Lojista',
  [ConfirmationSource.COURIER]: 'Entregador',
};