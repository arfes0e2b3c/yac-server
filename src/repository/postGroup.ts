import { inArray, sql } from 'drizzle-orm'
import { Context } from 'hono'
import {
	PostGroupDeleteInputSchema,
	PostGroupInputSchema,
} from '../../openapi/postGroup'
import { withDbConnection } from '../db/connection'
import { postGroupsTable } from '../db/schema/postGroups'

class PostGroupRepository {
	async getByGroupId(c: Context, groupId: string) {
		return withDbConnection(c, async (db) => {
			const res = await db.query.postGroupsTable.findMany({
				where: sql`${postGroupsTable.groupId} = ${groupId}`,
			})
			return res
		})
	}
	async create(c: Context, body: PostGroupInputSchema) {
		return withDbConnection(c, async (db) => {
			const [res] = await db.insert(postGroupsTable).values(body).returning({
				postId: postGroupsTable.postId,
				groupId: postGroupsTable.groupId,
			})
			return res
		})
	}
	async delete(c: Context, body: PostGroupDeleteInputSchema) {
		console.log('postGroupRepo.delete', body.groupId, body.postIds)
		return withDbConnection(c, async (db) => {
			const [res] = await db
				.delete(postGroupsTable)
				.where(
					sql`${inArray(postGroupsTable.postId, body.postIds)} and ${postGroupsTable.groupId} = ${body.groupId}`
				)
				.returning({
					postId: postGroupsTable.postId,
					groupId: postGroupsTable.groupId,
				})
			return res
		})
	}
}

export const postGroupRepo = new PostGroupRepository()
