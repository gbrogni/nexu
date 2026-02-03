import { Module } from '@nestjs/common';
import { AuditEventLogger } from './audit-event-logger';
import { OnUserCreatedAuditSubscriber } from './subscribers/accounts/on-user-created-audit.subscriber';
import { OnCourierAssigned } from './subscribers/orders/on-courier-assigned.subscriber';
import { OnOrderCreated } from './subscribers/orders/on-order-created.subscriber';
import { OnPaymentConfirmed } from './subscribers/orders/on-payment-confirmed.subscriber';
import { OnOrderStatusChanged } from './subscribers/orders/on-status-changed.subscriber';

@Module({
  providers: [
    AuditEventLogger,
    OnOrderCreated,
    OnOrderStatusChanged,
    OnCourierAssigned,
    OnPaymentConfirmed,
    OnUserCreatedAuditSubscriber,
  ],
  exports: [AuditEventLogger],
})
export class AuditModule { }