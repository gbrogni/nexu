import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { orders } from './orders';
import { users } from './users';

export const proofOfDeliveries = pgTable('proof_of_deliveries', {
  id: uuid('id').primaryKey().notNull(),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  uploadedByUserId: uuid('uploaded_by_user_id').notNull().references(() => users.id, { onDelete: 'set null' }),
  fileUrl: text('file_url').notNull(),
  mimeType: varchar('mime_type', { length: 64 }),
  uploadedAt: timestamp('uploaded_at', { withTimezone: true }).notNull(),
});