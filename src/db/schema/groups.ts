import { relations, sql } from 'drizzle-orm'
import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'
import { ulid } from 'ulid'
import { postGroupsTable } from './postGroups'
import { usersTable } from './users'

export const groupsTable = pgTable('groups', {
	id: varchar('id', { length: 36 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => ulid()),
	name: varchar('name', { length: 255 }).notNull().unique(),
	userId: varchar('user_id', { length: 36 })
		.references(() => usersTable.id, {
			onDelete: 'set null',
		})
		.notNull(),
	createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp('updated_at')
		.default(sql`CURRENT_TIMESTAMP`)
		.$onUpdate(() => sql`CURRENT_TIMESTAMP`)
		.notNull(),
	deletedAt: timestamp('deleted_at').default(sql`NULL`),
})

export const groupsRelation = relations(groupsTable, ({ one, many }) => ({
	user: one(usersTable, {
		fields: [groupsTable.userId],
		references: [usersTable.id],
	}),
	postGroups: many(postGroupsTable),
}))

export type GroupsTableSchema = typeof groupsTable.$inferSelect
