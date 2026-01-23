import { Injectable, Logger } from '@nestjs/common';
import { auditEvents } from '../database/schema/audit-events';
import { DatabaseService } from '../database/database.service';
import { randomUUID } from 'crypto';

export interface LogEventData {
  companyId: string;
  orderId?: string;
  userId?: string;
  eventType: string;
  description: string;
  metadata?: unknown;
  createdAt?: Date;
}

@Injectable()
export class AuditEventLogger {
  private readonly logger = new Logger(AuditEventLogger.name);

  constructor(private readonly dbService: DatabaseService) { }

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
      createdAt: data.createdAt ?? new Date(),
    } as any;

    await db.insert(auditEvents).values(row);
  }

  async safeLog(data: LogEventData): Promise<void> {
    try {
      await this.log(data);
    } catch (err) {
      this.logger.error(
        `Failed to write audit event: ${data.eventType}`,
        (err as any)?.stack ?? String(err),
      );
    }
  }
}