import { Module } from '@nestjs/common';
import { EnvModule } from '../env/env.module';
import { drizzleProviders } from './drizzle.provider';
import { DatabaseService } from './database.service';

@Module({
  imports: [EnvModule],
  providers: [...drizzleProviders, DatabaseService],
  exports: [...drizzleProviders, DatabaseService],
})
export class DrizzleModule {}