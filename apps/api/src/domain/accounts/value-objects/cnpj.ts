export class Cnpj {
  private readonly value: string;

  private constructor(normalized: string) {
    this.value = normalized;
  }

  private static create(value: string): Cnpj {
    const normalized = Cnpj.normalize(value);
    if (!Cnpj.isValid(normalized)) {
      throw new Error('Invalid CNPJ');
    }
    return new Cnpj(normalized);
  }

  public static tryCreate(value?: string | null): Cnpj | undefined {
    if (value == null || value === '') return undefined;
    return Cnpj.create(value);
  }

  public static normalize(value: string): string {
    return (value ?? '').replace(/\D/g, '');
  }

  public static isValid(normalized: string): boolean {
    if (!normalized || normalized.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(normalized)) return false; // all digits equal -> invalid

    const calcDigit = (digits: string, weights: number[]) => {
      const sum = digits
        .split('')
        .map((d, i) => parseInt(d, 10) * weights[i])
        .reduce((a, b) => a + b, 0);
      const r = sum % 11;
      return r < 2 ? 0 : 11 - r;
    };

    const base = normalized.slice(0, 12);
    const firstWeights = [5,4,3,2,9,8,7,6,5,4,3,2];
    const secondWeights = [6,5,4,3,2,9,8,7,6,5,4,3,2];

    const firstCheck = calcDigit(base, firstWeights);
    const secondCheck = calcDigit(base + String(firstCheck), secondWeights);

    return normalized === base + String(firstCheck) + String(secondCheck);
  }

  public getValue(): string {
    return this.value; // normalized 14 digits
  }

  public toString(): string {
    return this.value;
  }

  public formatted(): string {
    // 00.000.000/0000-00
    const d = this.value;
    if (d.length !== 14) return this.value;
    return `${d.slice(0,2)}.${d.slice(2,5)}.${d.slice(5,8)}/${d.slice(8,12)}-${d.slice(12,14)}`;
  }
}
