import { Module } from '@nestjs/common';
import { EnvModule } from '../env/env.module';
import { drizzleProviders } from './drizzle.provider';

@Module({
  imports: [EnvModule],
  providers: [...drizzleProviders],
  exports: [...drizzleProviders],
})
export class DrizzleModule {}