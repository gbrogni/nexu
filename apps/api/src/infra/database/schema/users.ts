import { pgTable, uuid, varchar, integer, timestamp } from 'drizzle-orm/pg-core';
import { companies } from './companies';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().notNull(),
  companyId: uuid('company_id').notNull().references(() => companies.id, { onDelete: 'restrict' }),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 32 }),
  role: integer('role').notNull(),
  status: integer('status').notNull(),
  passwordHash: varchar('password_hash', { length: 255 }),
  authProvider: integer('auth_provider').notNull(),
  authProviderId: varchar('auth_provider_id', { length: 255 }),
  profilePictureUrl: varchar('profile_picture_url', { length: 500 }),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});