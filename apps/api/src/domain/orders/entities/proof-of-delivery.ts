import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface ProofOfDeliveryProps {
  orderId: UniqueEntityID;
  uploadedByUserId: UniqueEntityID;
  fileUrl: string;
  mimeType?: string | null;
  uploadedAt: Date;
}

export class ProofOfDelivery extends Entity<ProofOfDeliveryProps> {

  get orderId(): UniqueEntityID {
    return this.props.orderId;
  }

  get uploadedByUserId(): UniqueEntityID {
    return this.props.uploadedByUserId;
  }

  get fileUrl(): string {
    return this.props.fileUrl;
  }

  get mimeType(): string | null | undefined {
    return this.props.mimeType;
  }

  get uploadedAt(): Date {
    return this.props.uploadedAt;
  }
}