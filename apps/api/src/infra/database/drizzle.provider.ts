import { Provider } from '@nestjs/common';
import { EnvService } from '../env/env.service';
import { createDrizzleClient } from './drizzle';

export const DRIZZLE_DB = Symbol('DRIZZLE_DB');
export const PG_POOL = Symbol('PG_POOL');

export const drizzleProviders: Provider[] = [
  {
    provide: 'DRIZZLE_CLIENT',
    inject: [EnvService],
    useFactory: (env: EnvService) => createDrizzleClient(env.get('DATABASE_URL')),
  },
  {
    provide: PG_POOL,
    inject: ['DRIZZLE_CLIENT'],
    useFactory: (client: ReturnType<typeof createDrizzleClient>) => client.pool,
  },
  {
    provide: DRIZZLE_DB,
    inject: ['DRIZZLE_CLIENT'],
    useFactory: (client: ReturnType<typeof createDrizzleClient>) => client.db,
  },
];