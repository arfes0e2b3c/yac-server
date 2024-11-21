import { relations, sql } from 'drizzle-orm'
import { pgTable, primaryKey, timestamp, varchar } from 'drizzle-orm/pg-core'
import { groupsTable } from './groups'
import { postsTable } from './posts'

export const postGroupsTable = pgTable(
	'post_groups',
	{
		postId: varchar('post_id', { length: 36 })
			.notNull()
			.references(() => postsTable.id, {
				onDelete: 'set null',
			}),
		groupId: varchar('group_id', { length: 36 })
			.notNull()
			.references(() => groupsTable.id, {
				onDelete: 'set null',
			}),
		createdAt: timestamp('created_at')
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp('updated_at')
			.default(sql`CURRENT_TIMESTAMP`)
			.$onUpdate(() => sql`CURRENT_TIMESTAMP`)
			.notNull(),
		deletedAt: timestamp('deleted_at').default(sql`NULL`),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.postId, t.groupId] }),
	})
)

export const postGroupsRelation = relations(postGroupsTable, ({ one }) => ({
	post: one(postsTable, {
		fields: [postGroupsTable.postId],
		references: [postsTable.id],
	}),
	group: one(groupsTable, {
		fields: [postGroupsTable.groupId],
		references: [groupsTable.id],
	}),
}))

export type PostGroupsTableSchema = typeof postGroupsTable.$inferSelect
