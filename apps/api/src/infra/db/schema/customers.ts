import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { companies } from './companies';

export const customers = pgTable('customers', {
  id: uuid('id').primaryKey().notNull(),
  companyId: uuid('company_id').notNull().references(() => companies.id, { onDelete: 'restrict' }),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 32 }),
  defaultAddressId: uuid('default_address_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
});