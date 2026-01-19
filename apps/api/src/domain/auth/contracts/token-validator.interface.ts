export abstract class TokenValidator {
  abstract isTokenValid(token: string): Promise<boolean>;
}