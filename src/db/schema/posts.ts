import { relations, sql } from 'drizzle-orm'
import { pgEnum, pgTable, point, timestamp, varchar } from 'drizzle-orm/pg-core'
import { ulid } from 'ulid'
import { mediaItemsTable } from './mediaItems'
import { postTagsTable } from './postTags'
import { usersTable } from './users'

export const visibilityEnum = pgEnum('visibility', [
	'private',
	'public',
	'only_followers',
])

export const postsTable = pgTable('posts', {
	id: varchar('id', { length: 26 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => ulid()),
	title: varchar('title', { length: 255 }).notNull(),
	content: varchar('content', { length: 1000 }).notNull(),
	locationLabel: varchar('location_label', { length: 255 }),
	locationPoint: point('location_point'),
	music: varchar('music', { length: 26 }).references(() => mediaItemsTable.id, {
		onDelete: 'cascade',
	}),
	imageUrl: varchar('image_url', { length: 255 }),
	relatedUrl: varchar('related_url', { length: 255 }),
	userId: varchar('user_id', { length: 26 })
		.references(() => usersTable.id, {
			onDelete: 'cascade',
		})
		.notNull(),
	mediaItemId: varchar('media_item_id', { length: 26 }).references(
		() => mediaItemsTable.id,
		{
			onDelete: 'cascade',
		}
	),
	visibility: visibilityEnum().notNull().default('public'),
	createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp('updated_at')
		.default(sql`CURRENT_TIMESTAMP`)
		.$onUpdate(() => sql`CURRENT_TIMESTAMP`)
		.notNull(),
	deletedAt: timestamp('deleted_at').default(sql`NULL`),
})

export const postsRelation = relations(postsTable, ({ one, many }) => ({
	user: one(usersTable, {
		fields: [postsTable.userId],
		references: [usersTable.id],
	}),
	mediaItem: one(mediaItemsTable, {
		fields: [postsTable.mediaItemId],
		references: [mediaItemsTable.id],
	}),
	postTag: many(postTagsTable),
}))

export type PostsTableSchema = typeof postsTable.$inferSelect
