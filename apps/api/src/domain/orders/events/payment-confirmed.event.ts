import { DomainEvent } from '@/core/events/domain-event';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ConfirmationSource } from '../enums';
import { Order } from '../entities';

export class PaymentConfirmedEvent implements DomainEvent {
  public ocurredAt: Date;
  public order: Order;
  public confirmedByUserId?: UniqueEntityID | null;
  public confirmationSource: ConfirmationSource;

  constructor(
    order: Order,
    confirmationSource: ConfirmationSource,
    confirmedByUserId?: UniqueEntityID | null,
  ) {
    this.order = order;
    this.confirmationSource = confirmationSource;
    this.confirmedByUserId = confirmedByUserId ?? null;
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.order.id;
  }
}