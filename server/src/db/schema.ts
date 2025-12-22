import { integer, pgEnum, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const todoStatusEnum = pgEnum('todo_status', ['todo', 'inProgress', 'done']);

export const usersTable = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  picture: varchar({ length: 512 }).notNull(),
});

export const todoTable = pgTable('todo', {
  id: uuid().primaryKey().notNull(),
  todo: varchar({ length: 255 }).notNull(),
  status: todoStatusEnum('status').notNull(),
  position: integer().notNull(),
});
