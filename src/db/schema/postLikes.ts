import { relations, sql } from 'drizzle-orm'
import { pgTable, primaryKey, timestamp, varchar } from 'drizzle-orm/pg-core'
import { postsTable } from './posts'
import { usersTable } from './users'

export const postLikesTable = pgTable(
	'post_likes',
	{
		postId: varchar('post_id', { length: 36 })
			.notNull()
			.references(() => postsTable.id, {
				onDelete: 'cascade',
			}),
		userId: varchar('user_id', { length: 36 })
			.notNull()
			.references(() => usersTable.id, {
				onDelete: 'cascade',
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
		pk: primaryKey({ columns: [t.userId, t.postId] }),
	})
)

export const postLikesRelation = relations(postLikesTable, ({ one }) => ({
	post: one(postsTable, {
		fields: [postLikesTable.postId],
		references: [postsTable.id],
	}),
	user: one(usersTable, {
		fields: [postLikesTable.userId],
		references: [usersTable.id],
	}),
}))

export type PostLikesTableSchema = typeof postLikesTable.$inferSelect
