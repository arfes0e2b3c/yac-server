import { sql } from 'drizzle-orm'
import { Context } from 'hono'
import { PostLikeInputSchema } from '../../openapi/postLike'
import { withDbConnection } from '../db/connection'
import { postLikesTable } from '../db/schema/postLikes'

class PostLikeRepository {
	async exist(c: Context, body: PostLikeInputSchema) {
		return withDbConnection(c, async (db) => {
			const res = await db
				.select()
				.from(postLikesTable)
				.where(
					sql`${postLikesTable.userId} = ${body.userId} and ${postLikesTable.postId} = ${body.postId}`
				)
			return res.length > 0
		})
	}
	async create(c: Context, body: PostLikeInputSchema) {
		return withDbConnection(c, async (db) => {
			const [res] = await db.insert(postLikesTable).values(body).returning({
				userId: postLikesTable.userId,
				postId: postLikesTable.postId,
			})
			return res
		})
	}
	async delete(c: Context, body: PostLikeInputSchema) {
		return withDbConnection(c, async (db) => {
			const [res] = await db
				.delete(postLikesTable)
				.where(
					sql`${postLikesTable.userId} = ${body.userId} and ${postLikesTable.postId} = ${body.postId}`
				)
				.returning({
					userId: postLikesTable.userId,
					postId: postLikesTable.postId,
				})
			return res
		})
	}
}

export const postLikeRepo = new PostLikeRepository()
