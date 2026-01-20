import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { EnvService } from '../env/env.service';
import { createDrizzleClient } from './drizzle';
import { Pool, PoolClient } from 'pg';
import { drizzle as createDrizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

type DrizzleSchema = typeof schema;

export type DrizzleDb = NodePgDatabase<DrizzleSchema> & { $client: Pool };
export type DrizzleTransactionDb = NodePgDatabase<DrizzleSchema> & { $client: PoolClient };

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private pool: Pool;
  private db: DrizzleDb;

  constructor(private readonly env: EnvService) {
    const databaseUrl = this.env.get('DATABASE_URL');
    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not defined in environment');
    }

    const client = createDrizzleClient(databaseUrl);
    this.pool = client.pool;
    this.db = client.db;
    this.logger.log('DatabaseService initialized');
  }

  getDb(): DrizzleDb {
    return this.db;
  }

  getPool() {
    return this.pool;
  }

  async withTransaction<T>(cb: (trxDb: DrizzleTransactionDb) => Promise<T>): Promise<T> {
    const client: PoolClient = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const trxDb = createDrizzle(client, { schema });
      const result = await cb(trxDb);
      await client.query('COMMIT');
      return result;
    } catch (err) {
      try {
        await client.query('ROLLBACK');
      } catch (rollbackErr) {
        this.logger.error('Failed to rollback transaction', rollbackErr as any);
      }
      throw err;
    } finally {
      client.release();
    }
  }

  async onModuleDestroy() {
    this.logger.log('Shutting down database pool');
    try {
      await this.pool.end();
    } catch (err) {
      this.logger.error('Error while shutting down database pool', err as any);
    }
  }
}
