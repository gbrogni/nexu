import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Entity } from '@/core/entities/entity';
import { PaymentMethod, PaymentStatus, ConfirmationSource } from '../enums';

export interface OrderPaymentProps {
  orderId: UniqueEntityID;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  confirmedByUserId?: UniqueEntityID | null;
  confirmedAt?: Date | null;
  confirmationSource?: ConfirmationSource | null;
  createdAt: Date;
  updatedAt: Date;
}

export class OrderPayment extends Entity<OrderPaymentProps> {

  get orderId(): UniqueEntityID {
    return this.props.orderId;
  }

  get method(): PaymentMethod {
    return this.props.method;
  }

  get status(): PaymentStatus {
    return this.props.status;
  }

  get amount(): number {
    return this.props.amount;
  }

  get confirmedByUserId(): UniqueEntityID | null | undefined {
    return this.props.confirmedByUserId;
  }

  get confirmedAt(): Date | null | undefined {
    return this.props.confirmedAt;
  }

  get confirmationSource(): ConfirmationSource | null | undefined {
    return this.props.confirmationSource;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}