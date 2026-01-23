import { pgTable, uuid, integer, numeric, text, timestamp } from 'drizzle-orm/pg-core';
import { companies } from './companies';
import { users } from './users';
import { orders } from './orders';

export const checkoutSessions = pgTable('checkout_sessions', {
  id: uuid('id').primaryKey().notNull(),
  companyId: uuid('company_id').notNull().references(() => companies.id, { onDelete: 'restrict' }),
  createdByUserId: uuid('created_by_user_id').notNull().references(() => users.id, { onDelete: 'set null' }),
  status: integer('status').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  defaultAmount: numeric('default_amount', { precision: 10, scale: 2 }),
  defaultPaymentMethod: integer('default_payment_method'),
  notes: text('notes'),
  orderId: uuid('order_id').references(() => orders.id, {
    onDelete: 'set null',
  }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
});