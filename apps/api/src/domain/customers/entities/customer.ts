import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface CustomerProps {
  companyId: UniqueEntityID;
  name: string;
  phone?: string;
  defaultAddressId?: UniqueEntityID;
  createdAt: Date;
  updatedAt: Date;
}

export class Customer extends Entity<CustomerProps> {

  get companyId(): UniqueEntityID {
    return this.props.companyId;
  }

  get name(): string {
    return this.props.name;
  }

  get phone(): string | undefined {
    return this.props.phone;
  }

  get defaultAddressId(): UniqueEntityID | undefined {
    return this.props.defaultAddressId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}