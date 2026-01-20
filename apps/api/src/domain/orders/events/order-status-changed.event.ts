import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { DomainEvent } from '@/core/events/domain-event';
import { Order } from '../entities';
import { OrderStatus } from '../enums';

export class OrderStatusChangedEvent implements DomainEvent {
  public ocurredAt: Date;
  public order: Order;
  public previousStatus: OrderStatus;
  public newStatus: OrderStatus;

  constructor(order: Order, previousStatus: OrderStatus, newStatus: OrderStatus) {
    this.order = order;
    this.previousStatus = previousStatus;
    this.newStatus = newStatus;
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.order.id;
  }
}