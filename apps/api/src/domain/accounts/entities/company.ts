import { Entity } from '@/core/entities/entity';
import { CommissionMode } from '../enums';

export interface CompanyProps {
  name: string;
  slug: string;
  podRequired: boolean;
  allowCourierConfirmPayment: boolean;
  commissionMode: CommissionMode;
  commissionValue: string;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Company extends Entity<CompanyProps> {

  get name(): string {
    return this.props.name;
  }

  get slug(): string {
    return this.props.slug;
  }

  get podRequired(): boolean {
    return this.props.podRequired;
  }

  get allowCourierConfirmPayment(): boolean {
    return this.props.allowCourierConfirmPayment;
  }

  get commissionMode(): CommissionMode {
    return this.props.commissionMode;
  }

  get commissionValue(): string {
    return this.props.commissionValue;
  }

  get timezone(): string {
    return this.props.timezone;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}