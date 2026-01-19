export class ProfilePictureUrl {
  private readonly value: string;

  private constructor(url: string) {
    this.value = url;
  }

  public static create(url: string): ProfilePictureUrl {
    if (!ProfilePictureUrl.isValidUrl(url)) {
      throw new Error('Invalid profile picture URL');
    }
    return new ProfilePictureUrl(url);
  }

  private static isValidUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch (error) {
      console.error('Invalid URL:', url, error);
      return false;
    }
  }

  public getValue(): string {
    return this.value;
  }

  public toString(): string {
    return this.value;
  }
}