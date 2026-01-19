import { pgTable, uuid, varchar, boolean, numeric, integer, timestamp } from 'drizzle-orm/pg-core';

export const companies = pgTable('companies', {
  id: uuid('id').primaryKey().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 64 }).notNull(), // unique em index.ts
  podRequired: boolean('pod_required').notNull().default(false),
  allowCourierConfirmPayment: boolean('allow_courier_confirm_payment').notNull().default(true),
  commissionMode: integer('commission_mode').notNull(),
  commissionValue: numeric('commission_value', { precision: 10, scale: 2 }).notNull(),
  timezone: varchar('timezone', { length: 64 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});