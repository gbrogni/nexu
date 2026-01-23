import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

export const tokenBlacklist = pgTable('token_blacklist', {
  id: uuid('id').primaryKey().notNull(),
  token: varchar('token', { length: 500 }).notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
},
  (table) => [
    uniqueIndex('token_blacklist_token_unique').on(table.token),
  ],
);
