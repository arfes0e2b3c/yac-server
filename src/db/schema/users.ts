import { relations, sql } from 'drizzle-orm'
import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'
import { ulid } from 'ulid'
import { postsTable } from './posts'
import { tagsTable } from './tags'

export const usersTable = pgTable('users', {
	id: varchar('id', { length: 36 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => ulid()),
	userCode: varchar('user_code', { length: 255 }).notNull().unique(),
	name: varchar('name', { length: 255 }).notNull(),
	bio: varchar('bio', { length: 255 }),
	lastLoginedAt: timestamp('last_logined_at').default(sql`NULL`),
	createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp('updated_at')
		.default(sql`CURRENT_TIMESTAMP`)
		.$onUpdate(() => sql`CURRENT_TIMESTAMP`)
		.notNull(),
	deletedAt: timestamp('deleted_at').default(sql`NULL`),
})

export const usersRelation = relations(usersTable, ({ many }) => ({
	tagsTable: many(tagsTable),
	postsTable: many(postsTable),
}))

export type UsersTableSchema = typeof usersTable.$inferSelect
