export enum OrderStatus {
  TO_DO = 1,
  ASSIGNED = 2,
  IN_ROUTE = 3,
  DELIVERED = 4,
  PROBLEM = 5,
  CANCELLED = 6,
}

export const OrderStatusLabel: Record<OrderStatus, string> = {
  [OrderStatus.TO_DO]: 'A Fazer',
  [OrderStatus.ASSIGNED]: 'Atribuído',
  [OrderStatus.IN_ROUTE]: 'Em rota',
  [OrderStatus.DELIVERED]: 'Entregue',
  [OrderStatus.PROBLEM]: 'Problema',
  [OrderStatus.CANCELLED]: 'Cancelado',
};