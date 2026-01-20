export enum AuthProvider {
  LOCAL = 1,
  GOOGLE = 2,
}

export const AuthProviderLabel: Record<AuthProvider, string> = {
  [AuthProvider.LOCAL]: 'Local',
  [AuthProvider.GOOGLE]: 'Google',
};