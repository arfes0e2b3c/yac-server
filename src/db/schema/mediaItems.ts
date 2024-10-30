import { relations, sql } from 'drizzle-orm'
import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'
import { ulid } from 'ulid'
import { postTagsTable } from './postTags'
import { postsTable } from './posts'

export const mediaItemsTable = pgTable('media_items', {
	id: varchar('id', { length: 26 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => ulid()),
	title: varchar('title', { length: 255 }).notNull(),
	imageUrl: varchar('image_url', { length: 255 }).notNull(),
	createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp('updated_at')
		.default(sql`CURRENT_TIMESTAMP`)
		.$onUpdate(() => sql`CURRENT_TIMESTAMP`)
		.notNull(),
	deletedAt: timestamp('deleted_at').default(sql`NULL`),
})

export const mediaItemsToPostsRelation = relations(
	mediaItemsTable,
	({ many }) => ({
		posts: many(postsTable),
	})
)

export type MediaItemsTableSchema = typeof mediaItemsTable.$inferSelect
