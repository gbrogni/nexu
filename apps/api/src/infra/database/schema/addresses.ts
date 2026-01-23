import { pgTable, uuid, varchar, boolean, numeric, timestamp } from 'drizzle-orm/pg-core';
import { companies } from './companies';
import { customers } from './customers';

export const addresses = pgTable('addresses', {
  id: uuid('id').primaryKey().notNull(),
  companyId: uuid('company_id').notNull().references(() => companies.id, { onDelete: 'restrict' }),
  customerId: uuid('customer_id').notNull().references(() => customers.id, { onDelete: 'restrict' }),
  street: varchar('street', { length: 255 }).notNull(),
  number: varchar('number', { length: 32 }).notNull(),
  district: varchar('district', { length: 128 }).notNull(),
  city: varchar('city', { length: 128 }).notNull(),
  state: varchar('state', { length: 16 }).notNull(),
  zipCode: varchar('zip_code', { length: 16 }),
  reference: varchar('reference', { length: 255 }),
  latitude: numeric('latitude', { precision: 9, scale: 6 }),
  longitude: numeric('longitude', { precision: 9, scale: 6 }),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
});