import { inArray, sql } from 'drizzle-orm'
import { Context } from 'hono'

import {
	PostTagDeleteInputSchema,
	PostTagInputSchema,
} from '../../openapi/postTag'
import { withDbConnection } from '../db/connection'
import { postTagsTable } from '../db/schema/postTags'

class PostTagRepository {
	async getByTagId(c: Context, tagId: string) {
		return withDbConnection(c, async (db) => {
			const res = await db.query.postTagsTable.findMany({
				where: sql`${postTagsTable.tagId} = ${tagId}`,
			})
			return res
		})
	}
	async create(c: Context, body: PostTagInputSchema) {
		return withDbConnection(c, async (db) => {
			const [res] = await db.insert(postTagsTable).values(body).returning({
				postId: postTagsTable.postId,
				tagId: postTagsTable.tagId,
			})
			return res
		})
	}
	async delete(c: Context, body: PostTagDeleteInputSchema) {
		return withDbConnection(c, async (db) => {
			const [res] = await db
				.delete(postTagsTable)
				.where(
					sql`${inArray(postTagsTable.postId, body.postIds)} and ${postTagsTable.tagId} = ${body.tagId}`
				)
				.returning({
					postId: postTagsTable.postId,
					tagId: postTagsTable.tagId,
				})
			return res
		})
	}
}

export const postTagRepo = new PostTagRepository()
