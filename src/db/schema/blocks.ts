import { relations, sql } from 'drizzle-orm'
import { pgTable, primaryKey, timestamp, varchar } from 'drizzle-orm/pg-core'
import { usersTable } from './users'

export const blocksTable = pgTable(
	'blocks',
	{
		userId: varchar('user_id', { length: 36 })
			.references(() => usersTable.id, {
				onDelete: 'no action',
			})
			.notNull(),
		targetUserId: varchar('user_id', { length: 36 })
			.references(() => usersTable.id, {
				onDelete: 'no action',
			})
			.notNull(),
		createdAt: timestamp('created_at')
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		deletedAt: timestamp('deleted_at').default(sql`NULL`),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.userId, t.targetUserId] }),
	})
)

export const blocksRelation = relations(blocksTable, ({ one }) => ({
	user: one(usersTable),
}))

export type UsersTableSchema = typeof blocksTable.$inferSelect
