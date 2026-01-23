import { Injectable, OnModuleInit } from '@nestjs/common';
import { DomainEvents } from '@/core/events/domain-events';
import { EventHandler } from '@/core/events/event-handler';
import { CourierAssignedEvent } from '@/domain/orders/events/courier-assigned.event';
import { AuditEventLogger } from '../../audit-event-logger';

@Injectable()
export class OnCourierAssigned implements EventHandler, OnModuleInit {
  constructor(private auditEventLogger: AuditEventLogger) { }

  onModuleInit() {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(this.onCourierAssigned.bind(this), CourierAssignedEvent.name);
  }

  private async onCourierAssigned(event: CourierAssignedEvent): Promise<void> {
    await this.auditEventLogger.safeLog({
      companyId: event.order.companyId.toString(),
      orderId: event.order.id.toString(),
      eventType: 'courier_assigned',
      description: `Entregador atribuído ao pedido ${event.order.publicCode}`,
      createdAt: event.ocurredAt,
      metadata: {
        publicCode: event.order.publicCode,
        courierId: event.courierId.toString(),
      },
    });
  }
}