import { relations, sql } from 'drizzle-orm'
import { pgTable, timestamp, unique, varchar } from 'drizzle-orm/pg-core'
import { ulid } from 'ulid'
import { usersTable } from './users'
import { postTagsTable } from './postTags'

export const tagsTable = pgTable(
	'tags',
	{
		id: varchar('id', { length: 36 })
			.notNull()
			.primaryKey()
			.$defaultFn(() => ulid()),
		name: varchar('name', { length: 255 }).notNull(),
		userId: varchar('user_id', { length: 36 })
			.references(() => usersTable.id, {
				onDelete: 'set null',
			})
			.notNull(),
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
		unique: unique().on(t.name, t.userId),
	})
)

export const tagsRelation = relations(tagsTable, ({ one, many }) => ({
	user: one(usersTable, {
		fields: [tagsTable.userId],
		references: [usersTable.id],
	}),
	postTags: many(postTagsTable),
}))

export type TagsTableSchema = typeof tagsTable.$inferSelect
