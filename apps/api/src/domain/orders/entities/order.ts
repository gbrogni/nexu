import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  OrderOriginType,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  ConfirmationSource,
} from '../enums';
import { AggregateRoot } from '@/core/entities/aggregate-root';
import { OrderStatusChangedEvent } from '../events/order-status-changed.event';
import { OrderCreatedEvent } from '../events/order-created.event';
import { CourierAssignedEvent } from '../events/courier-assigned.event';
import { PaymentConfirmedEvent } from '../events/payment-confirmed.event';

export interface OrderProps {
  companyId: UniqueEntityID;
  publicCode: string;
  originType: OrderOriginType;
  checkoutSessionId?: UniqueEntityID | null;
  customerId: UniqueEntityID;
  addressId: UniqueEntityID;
  courierId?: UniqueEntityID | null;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  customerNote?: string | null;
  internalNote?: string | null;
  routePosition?: number | null;
  createdAt: Date;
  assignedAt?: Date | null;
  inRouteAt?: Date | null;
  deliveredAt?: Date | null;
  cancelledAt?: Date | null;
  problemAt?: Date | null;
  updatedAt: Date;
}

export class Order extends AggregateRoot<OrderProps> {

  get companyId(): UniqueEntityID {
    return this.props.companyId;
  }

  get publicCode(): string {
    return this.props.publicCode;
  }

  get originType(): OrderOriginType {
    return this.props.originType;
  }

  get checkoutSessionId(): UniqueEntityID | null | undefined {
    return this.props.checkoutSessionId;
  }

  get customerId(): UniqueEntityID {
    return this.props.customerId;
  }

  get addressId(): UniqueEntityID {
    return this.props.addressId;
  }

  get courierId(): UniqueEntityID | null | undefined {
    return this.props.courierId;
  }

  get status(): OrderStatus {
    return this.props.status;
  }

  get paymentMethod(): PaymentMethod {
    return this.props.paymentMethod;
  }

  get paymentStatus(): PaymentStatus {
    return this.props.paymentStatus;
  }

  get totalAmount(): number {
    return this.props.totalAmount;
  }

  get customerNote(): string | null | undefined {
    return this.props.customerNote;
  }

  get internalNote(): string | null | undefined {
    return this.props.internalNote;
  }

  get routePosition(): number | null | undefined {
    return this.props.routePosition;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get assignedAt(): Date | null | undefined {
    return this.props.assignedAt;
  }

  get inRouteAt(): Date | null | undefined {
    return this.props.inRouteAt;
  }

  get deliveredAt(): Date | null | undefined {
    return this.props.deliveredAt;
  }

  get cancelledAt(): Date | null | undefined {
    return this.props.cancelledAt;
  }

  get problemAt(): Date | null | undefined {
    return this.props.problemAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  assignCourier(courierId: UniqueEntityID): void {
    if (this.props.status !== OrderStatus.TO_DO) {
      throw new Error('Only TO_DO orders can be assigned');
    }

    const previousStatus = this.props.status;
    this.props.courierId = courierId;
    this.props.status = OrderStatus.ASSIGNED;
    this.props.assignedAt = new Date();
    this.props.updatedAt = new Date();

    this.addDomainEvent(new CourierAssignedEvent(this, courierId));
    this.addDomainEvent(new OrderStatusChangedEvent(this, previousStatus, OrderStatus.ASSIGNED));
  }

  markAsDelivered(): void {
    if (this.props.status !== OrderStatus.IN_ROUTE) {
      throw new Error('Only IN_ROUTE orders can be marked as delivered');
    }

    const previousStatus = this.props.status;

    this.props.status = OrderStatus.DELIVERED;
    this.props.deliveredAt = new Date();
    this.props.updatedAt = new Date();

    this.addDomainEvent(new OrderStatusChangedEvent(this, previousStatus, OrderStatus.DELIVERED));
  }

  confirmPayment(
    confirmationSource: ConfirmationSource,
    confirmedByUserId?: UniqueEntityID | null,
  ): void {
    if (this.props.paymentStatus !== PaymentStatus.PENDING) {
      throw new Error('Only PENDING payments can be confirmed');
    }

    this.props.paymentStatus = PaymentStatus.PAID;
    this.props.updatedAt = new Date();

    this.addDomainEvent(new PaymentConfirmedEvent(this, confirmationSource, confirmedByUserId));
  }

  static create(props: Omit<OrderProps, 'createdAt' | 'updatedAt'>, id?: UniqueEntityID): Order {
    const order = new Order(
      {
        ...props,
        status: OrderStatus.TO_DO,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      id,
    );

    if (!id) {
      order.addDomainEvent(new OrderCreatedEvent(order));
    }

    return order;
  }

  static reconstitute(props: OrderProps, id: UniqueEntityID): Order {
    return new Order(props, id);
  }
}