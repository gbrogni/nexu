import { Injectable, OnModuleInit } from '@nestjs/common';
import { DomainEvents } from '@/core/events/domain-events';
import { EventHandler } from '@/core/events/event-handler';
import { OrderStatusChangedEvent } from '@/domain/orders/events/order-status-changed.event';
import { OrderStatus, OrderStatusLabel } from '@/domain/orders/enums';
import { AuditEventLogger } from '../../audit-event-logger';

@Injectable()
export class OnOrderStatusChanged implements EventHandler, OnModuleInit {
  constructor(private auditEventLogger: AuditEventLogger) { }

  onModuleInit() {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(this.onStatusChanged.bind(this), OrderStatusChangedEvent.name);
  }

  private async onStatusChanged(event: OrderStatusChangedEvent): Promise<void> {
    if (event.newStatus === OrderStatus.ASSIGNED) return

    await this.auditEventLogger.safeLog({
      companyId: event.order.companyId.toString(),
      orderId: event.order.id.toString(),
      eventType: 'order_status_changed',
      description: `Pedido ${event.order.publicCode}: ${OrderStatusLabel[event.previousStatus]} → ${OrderStatusLabel[event.newStatus]}`,
      createdAt: event.ocurredAt,
      metadata: {
        publicCode: event.order.publicCode,
        previousStatus: event.previousStatus,
        newStatus: event.newStatus,
      },
    });
  }
}