import { Injectable, OnModuleInit } from '@nestjs/common';
import { DomainEvents } from '@/core/events/domain-events';
import { EventHandler } from '@/core/events/event-handler';
import { UserCreatedEvent } from '@/domain/accounts/events/user-created.event';
import { AuditEventLogger } from '../../audit-event-logger';

@Injectable()
export class OnUserCreatedAuditSubscriber implements EventHandler, OnModuleInit {
  constructor(private auditEventLogger: AuditEventLogger) { }

  onModuleInit() {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(this.onUserCreated.bind(this), UserCreatedEvent.name);
  }

  private async onUserCreated(event: UserCreatedEvent): Promise<void> {
    await this.auditEventLogger.safeLog({
      companyId: event.user.companyId.toString(),
      userId: event.user.id.toString(),
      eventType: 'user_created',
      description: `Usuário ${event.user.name} criado`,
      createdAt: event.ocurredAt,
      metadata: {
        name: event.user.name,
        email: event.user.email ?? null,
        role: event.user.role,
        status: event.user.status,
        authProvider: event.user.authProvider,
      },
    });
  }
}