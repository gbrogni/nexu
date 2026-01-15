import { Module } from '@nestjs/common';
import { EnvModule } from './env/env.module';
import { DrizzleModule } from './db/drizzle.module';

@Module({
  imports: [EnvModule, DrizzleModule],
})
export class AppModule {}