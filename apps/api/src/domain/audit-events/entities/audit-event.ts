import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface AuditEventProps {
  companyId: UniqueEntityID;
  orderId?: UniqueEntityID;
  userId?: UniqueEntityID;
  eventType: string;
  description?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export class AuditEvent extends Entity<AuditEventProps> {

  get companyId(): UniqueEntityID {
    return this.props.companyId;
  }

  get orderId(): UniqueEntityID | undefined {
    return this.props.orderId;
  }

  get userId(): UniqueEntityID | undefined {
    return this.props.userId;
  }

  get eventType(): string {
    return this.props.eventType;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get metadata(): Record<string, any> | undefined {
    return this.props.metadata;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}