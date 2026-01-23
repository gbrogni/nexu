import { Injectable, OnModuleInit } from '@nestjs/common';
import { DomainEvents } from '@/core/events/domain-events';
import { EventHandler } from '@/core/events/event-handler';
import { PaymentConfirmedEvent } from '@/domain/orders/events/payment-confirmed.event';
import { ConfirmationSourceLabel } from '@/domain/orders/enums';
import { AuditEventLogger } from '../../audit-event-logger';

@Injectable()
export class OnPaymentConfirmed implements EventHandler, OnModuleInit {
  constructor(private auditEventLogger: AuditEventLogger) { }

  onModuleInit() {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(this.onPaymentConfirmed.bind(this), PaymentConfirmedEvent.name);
  }

  private async onPaymentConfirmed(event: PaymentConfirmedEvent): Promise<void> {
    await this.auditEventLogger.safeLog({
      companyId: event.order.companyId.toString(),
      orderId: event.order.id.toString(),
      userId: event.confirmedByUserId?.toString() ?? undefined,
      eventType: 'payment_confirmed',
      description: `Pagamento confirmado no pedido ${event.order.publicCode} (${ConfirmationSourceLabel[event.confirmationSource]})`,
      createdAt: event.ocurredAt,
      metadata: {
        publicCode: event.order.publicCode,
        confirmationSource: event.confirmationSource,
        confirmedByUserId: event.confirmedByUserId?.toString() ?? null,
        totalAmount: event.order.totalAmount,
      },
    });
  }
}