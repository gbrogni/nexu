import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface AddressProps {
  companyId: UniqueEntityID;
  customerId: UniqueEntityID;
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
  zipCode?: string;
  reference?: string;
  latitude?: number;
  longitude?: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Address extends Entity<AddressProps> {

  get companyId(): UniqueEntityID {
    return this.props.companyId;
  }

  get customerId(): UniqueEntityID {
    return this.props.customerId;
  }

  get street(): string {
    return this.props.street;
  }

  get number(): string {
    return this.props.number;
  }

  get district(): string {
    return this.props.district;
  }

  get city(): string {
    return this.props.city;
  }

  get state(): string {
    return this.props.state;
  }

  get zipCode(): string | undefined {
    return this.props.zipCode;
  }

  get reference(): string | undefined {
    return this.props.reference;
  }

  get latitude(): number | undefined {
    return this.props.latitude;
  }

  get longitude(): number | undefined {
    return this.props.longitude;
  }

  get isActive(): boolean {
    return this.props.isActive ?? true;
  }

  get createdAt(): Date {
    return this.props.createdAt ?? new Date();
  }

  get updatedAt(): Date {
    return this.props.updatedAt ?? new Date();
  }
}