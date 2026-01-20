import { Injectable } from '@nestjs/common';
import { DomainEvents } from '@/core/events/domain-events';
import { EventHandler } from '@/core/events/event-handler';
import { OrderCreatedEvent } from '@/domain/orders/events/order-created.event';
import { AuditEventLogger } from '../audit-event-logger';

@Injectable()
export class OnOrderCreated implements EventHandler {
  constructor(private auditEventLogger: AuditEventLogger) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.onOrderCreated.bind(this),
      OrderCreatedEvent.name
    );
  }

  private async onOrderCreated(event: OrderCreatedEvent): Promise<void> {
    await this.auditEventLogger.log({
      companyId: event.order.companyId.toString(),
      orderId: event.order.id.toString(),
      eventType: 'order_created',
      description: `Pedido ${event.order.publicCode} criado`,
      metadata: {
        status: event.order.status,
      },
    });
  }
}