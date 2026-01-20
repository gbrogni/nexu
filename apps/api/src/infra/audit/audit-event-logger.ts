import { Injectable } from '@nestjs/common';
import { auditEvents } from '../db/schema/audit-events';
import { DatabaseService } from '../db/database.service';
import { randomUUID } from 'crypto';

export interface LogEventData {
  companyId: string;
  orderId?: string;
  userId?: string;
  eventType: string;
  description: string;
  metadata?: unknown;
}

@Injectable()
export class AuditEventLogger {
  constructor(private readonly dbService: DatabaseService) {}

  async log(data: LogEventData): Promise<void> {
    const db = this.dbService.getDb();
    const row = {
      id: randomUUID(),
      companyId: data.companyId,
      orderId: data.orderId ?? null,
      userId: data.userId ?? null,
      eventType: data.eventType,
      description: data.description,
      metadata: data.metadata ?? null,
      createdAt: new Date(),
    } as any;

    await db.insert(auditEvents).values(row);
  }
}