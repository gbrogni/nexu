export function isValidEnumValue<T extends Record<string, number>>(
  enumObj: T,
  value: number,
): boolean {
  return Object.values(enumObj).includes(value);
}

export function parseEnum<T extends Record<string, number>>(
  enumObj: T,
  key: string,
): number | undefined {
  return enumObj[key as keyof T];
}

export function getEnumKey<T extends Record<string, number>>(
  enumObj: T,
  value: number,
): string | undefined {
  return Object.keys(enumObj).find((key) => enumObj[key as keyof T] === value);
}