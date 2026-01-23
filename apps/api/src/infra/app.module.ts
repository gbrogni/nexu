import { Module } from '@nestjs/common';
import { EnvModule } from './env/env.module';
import { DatabaseModule } from './database/database.module';
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [EnvModule, DatabaseModule, AuditModule],
})
export class AppModule { }