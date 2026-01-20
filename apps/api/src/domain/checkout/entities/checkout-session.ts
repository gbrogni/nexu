import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { CheckoutSessionStatus } from '../enums';

export interface CheckoutSessionProps {
  companyId: UniqueEntityID;
  createdByUserId: UniqueEntityID;
  status: CheckoutSessionStatus;
  expiresAt: Date;
  defaultAmount?: number;
  defaultPaymentMethod?: number;
  notes?: string;
  orderId?: UniqueEntityID;
  createdAt: Date;
  updatedAt: Date;
}

export class CheckoutSession extends Entity<CheckoutSessionProps> {

  get companyId(): UniqueEntityID {
    return this.props.companyId;
  }

  get createdByUserId(): UniqueEntityID {
    return this.props.createdByUserId;
  }

  get status(): CheckoutSessionStatus {
    return this.props.status;
  }

  get expiresAt(): Date {
    return this.props.expiresAt;
  }

  get defaultAmount(): number | undefined {
    return this.props.defaultAmount;
  }

  get defaultPaymentMethod(): number | undefined {
    return this.props.defaultPaymentMethod;
  }

  get notes(): string | undefined {
    return this.props.notes;
  }

  get orderId(): UniqueEntityID | undefined {
    return this.props.orderId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}