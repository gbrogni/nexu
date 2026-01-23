import { pgTable, uuid, varchar, integer, numeric, text, timestamp } from 'drizzle-orm/pg-core';
import { companies } from './companies';
import { customers } from './customers';
import { addresses } from './addresses';
import { users } from './users';
import { checkoutSessions } from './checkout-sessions';

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().notNull(),
  companyId: uuid('company_id').notNull().references(() => companies.id, { onDelete: 'restrict' }),
  publicCode: varchar('public_code', { length: 16 }).notNull(),
  originType: integer('origin_type').notNull(),
  checkoutSessionId: uuid('checkout_session_id').references(() => checkoutSessions.id, {
    onDelete: 'set null',
  }),
  customerId: uuid('customer_id').notNull().references(() => customers.id, { onDelete: 'restrict' }),
  addressId: uuid('address_id').notNull().references(() => addresses.id, { onDelete: 'restrict' }),
  courierId: uuid('courier_id').references(() => users.id, {
    onDelete: 'set null',
  }),
  status: integer('status').notNull(),
  paymentMethod: integer('payment_method').notNull(),
  paymentStatus: integer('payment_status').notNull(),
  totalAmount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(),
  customerNote: text('customer_note'),
  internalNote: text('internal_note'),
  routePosition: integer('route_position'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  assignedAt: timestamp('assigned_at', { withTimezone: true }),
  inRouteAt: timestamp('in_route_at', { withTimezone: true }),
  deliveredAt: timestamp('delivered_at', { withTimezone: true }),
  cancelledAt: timestamp('cancelled_at', { withTimezone: true }),
  problemAt: timestamp('problem_at', { withTimezone: true }),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
});