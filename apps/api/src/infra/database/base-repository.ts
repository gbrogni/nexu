import { DatabaseService } from './database.service';

export abstract class BaseRepository {
  constructor(protected readonly dbService: DatabaseService) {}

  protected get db() {
    return this.dbService.getDb();
  }

  protected async transaction<T>(cb: (trxDb: any) => Promise<T>): Promise<T> {
    return this.dbService.withTransaction(cb);
  }
}