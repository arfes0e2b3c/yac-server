import { relations, sql } from 'drizzle-orm'
import { pgTable, primaryKey, timestamp, varchar } from 'drizzle-orm/pg-core'
import { postsTable } from './posts'
import { tagsTable } from './tags'

export const postTagsTable = pgTable(
	'post_tags',
	{
		postId: varchar('post_id', { length: 36 })
			.notNull()
			.references(() => postsTable.id, {
				onDelete: 'set null',
			}),
		tagId: varchar('tag_id', { length: 36 })
			.notNull()
			.references(() => tagsTable.id, {
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
		pk: primaryKey({ columns: [t.postId, t.tagId] }),
	})
)

export const postTagsRelation = relations(postTagsTable, ({ one }) => ({
	post: one(postsTable, {
		fields: [postTagsTable.postId],
		references: [postsTable.id],
	}),
	tag: one(tagsTable, {
		fields: [postTagsTable.tagId],
		references: [tagsTable.id],
	}),
}))

export type PostTagsTableSchema = typeof postTagsTable.$inferSelect
