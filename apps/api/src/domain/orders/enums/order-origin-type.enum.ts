export enum OrderOriginType {
  CHECKOUT_LINK = 1,
  PASTE_CONVERSATION = 2,
  MANUAL = 3,
}

export const OrderOriginTypeLabel: Record<OrderOriginType, string> = {
  [OrderOriginType.CHECKOUT_LINK]: 'Link de checkout',
  [OrderOriginType.PASTE_CONVERSATION]: 'Colar conversa',
  [OrderOriginType.MANUAL]: 'Manual',
};