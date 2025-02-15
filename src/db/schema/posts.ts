import { relations, sql } from 'drizzle-orm'
import {
	boolean,
	customType,
	doublePrecision,
	pgEnum,
	pgTable,
	point,
	timestamp,
	varchar,
} from 'drizzle-orm/pg-core'
import { ulid } from 'ulid'
import { mediaItemsTable } from './mediaItems'
import { postLikesTable } from './postLikes'
import { postTagsTable } from './postTags'
import { usersTable } from './users'

export const visibilityEnum = pgEnum('visibility', [
	'private',
	'public',
	'only_followers',
])

export const PostsTableVisibility = {
	PRIVATE: visibilityEnum.enumValues[0],
	PUBLIC: visibilityEnum.enumValues[1],
	ONLY_FOLLOWERS: visibilityEnum.enumValues[2],
}
const encryptedText = customType<{ data: Buffer }>({
	dataType() {
		return 'bytea'
	},
})

export const postsTable = pgTable('posts', {
	id: varchar('id', { length: 36 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => ulid()),
	content: varchar('content', { length: 4096 }).notNull(),
	encryptContent: encryptedText('encrypt_content', { length: 8192 })
		.notNull()
		.default(sql`''`),
	locationLabel: varchar('location_label', { length: 255 }),
	locationPoint: point('location_point'),
	imageUrl: varchar('image_url', { length: 255 }),
	relatedUrl: varchar('related_url', { length: 255 }),
	userId: varchar('user_id', { length: 36 })
		.references(() => usersTable.id, {
			onDelete: 'set null',
		})
		.notNull(),
	mediaItemId: varchar('media_item_id', { length: 36 })
		.references(() => mediaItemsTable.id, {
			onDelete: 'set null',
		})
		.default(sql`NULL`),
	visibility: visibilityEnum().notNull().default('public'),
	date: timestamp('date'),
	score: doublePrecision('score').default(0).notNull(),
	createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
	isDraft: boolean('is_draft').default(false).notNull(),
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
	postTags: many(postTagsTable),
	postLikes: many(postLikesTable),
}))

export type PostsTableSchema = typeof postsTable.$inferSelect
