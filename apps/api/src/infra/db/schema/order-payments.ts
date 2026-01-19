import { pgTable, uuid, integer, numeric, timestamp } from 'drizzle-orm/pg-core';
import { orders } from './orders';
import { users } from './users';

export const orderPayments = pgTable('order_payments', {
  id: uuid('id').primaryKey().notNull(),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  method: integer('method').notNull(),
  status: integer('status').notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  confirmedByUserId: uuid('confirmed_by_user_id').references(() => users.id, {
    onDelete: 'set null',
  }),
  confirmedAt: timestamp('confirmed_at', { withTimezone: true }),
  confirmationSource: integer('confirmation_source'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
});