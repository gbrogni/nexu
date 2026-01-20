import { DatabaseService } from './database.service';

/**
 * Minimal base repository to be extended by concrete repositories.
 * Keeps repositories thin and delegates transaction management to DatabaseService.
 */
export abstract class BaseRepository {
  constructor(protected readonly dbService: DatabaseService) {}

  protected get db() {
    return this.dbService.getDb();
  }

  /** Run a callback inside a transaction. Useful for multi-step writes. */
  protected async transaction<T>(cb: (trxDb: any) => Promise<T>): Promise<T> {
    return this.dbService.withTransaction(cb);
  }
}
