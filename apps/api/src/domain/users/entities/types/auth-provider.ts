export type AuthProvider = 'GOOGLE' | 'LOCAL';

const AUTH_PROVIDERS = ['GOOGLE', 'LOCAL'] as const;

export function parseAuthProvider(value: string): AuthProvider {
  if (!isValidAuthProvider(value)) {
    throw new Error(`Invalid auth provider: ${value}. Expected: ${AUTH_PROVIDERS.join(' | ')}`);
  }

  return value;
}

function isValidAuthProvider(value: string): value is AuthProvider {
  return AUTH_PROVIDERS.includes(value as AuthProvider);
}