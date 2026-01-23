import { DomainEvent } from '@/core/events/domain-event';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Order } from '../entities';

export class CourierAssignedEvent implements DomainEvent {
  public ocurredAt: Date;
  public order: Order;
  public courierId: UniqueEntityID;

  constructor(order: Order, courierId: UniqueEntityID) {
    this.order = order;
    this.courierId = courierId;
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.order.id;
  }
}