import { pgTable, uuid, varchar, text, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { companies } from './companies';
import { orders } from './orders';
import { users } from './users';

export const auditEvents = pgTable('audit_events', {
  id: uuid('id').primaryKey().notNull(),
  companyId: uuid('company_id').notNull().references(() => companies.id, { onDelete: 'cascade' }),
  orderId: uuid('order_id').references(() => orders.id, {
    onDelete: 'set null',
  }),
  userId: uuid('user_id').references(() => users.id, {
    onDelete: 'set null',
  }),
  eventType: varchar('event_type', { length: 32 }).notNull(),
  description: text('description'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
});