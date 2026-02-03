import { randomBytes } from 'crypto';

export class ConfirmationToken {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static generate(): ConfirmationToken {
    const token = randomBytes(32).toString('hex');
    return new ConfirmationToken(token);
  }

  static create(value: string): ConfirmationToken {
    if (!value || value.length < 32) {
      throw new Error('Invalid confirmation token');
    }
    return new ConfirmationToken(value);
  }

  getValue(): string {
    return this.value;
  }

  equals(token: ConfirmationToken): boolean {
    return this.value === token.value;
  }

  toString(): string {
    return this.value;
  }
}