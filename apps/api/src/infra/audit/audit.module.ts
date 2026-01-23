import { Module } from '@nestjs/common';
import { AuditEventLogger } from './audit-event-logger';
import { DatabaseModule } from '../database/database.module';
import { OnUserCreated } from './subscribers/accounts/on-user-created.subscriber';
import { OnCourierAssigned } from './subscribers/orders/on-courier-assigned.subscriber';
import { OnOrderCreated } from './subscribers/orders/on-order-created.subscriber';
import { OnPaymentConfirmed } from './subscribers/orders/on-payment-confirmed.subscriber';
import { OnOrderStatusChanged } from './subscribers/orders/on-status-changed.subscriber';

@Module({
  imports: [DatabaseModule],
  providers: [
    AuditEventLogger,
    OnOrderCreated,
    OnOrderStatusChanged,
    OnCourierAssigned,
    OnPaymentConfirmed,
    OnUserCreated,
  ],
  exports: [AuditEventLogger],
})
export class AuditModule { }