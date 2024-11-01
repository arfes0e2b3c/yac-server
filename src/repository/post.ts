import { env } from 'bun'
import { sql } from 'drizzle-orm'
import { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { PostInputSchema, PostListSchema, PostSchema } from '../../openapi/post'
import { withDbConnection } from '../db/connection'
import { postsTable } from '../db/schema/posts'

class PostRepository {
	async getAll(c: Context) {
		return withDbConnection(c, async (db) => {
			return await db.query.postsTable.findMany({
				columns: {
					userId: false,
					mediaItemId: false,
				},
				with: {
					user: true,
					mediaItem: true,
					postTags: {
						columns: {
							postId: false,
							tagId: false,
							createdAt: false,
							updatedAt: false,
							deletedAt: false,
						},
						with: {
							tag: true,
						},
					},
				},
				where: sql`${postsTable.deletedAt} IS NULL`,
			})
		})
	}

	async getByPostId(c: Context, postId: string) {
		return withDbConnection(c, async (db) => {
			const res = await db.query.postsTable.findFirst({
				columns: {
					userId: false,
					mediaItemId: false,
				},
				with: {
					user: true,
					mediaItem: true,
					postTags: {
						columns: {
							postId: false,
							tagId: false,
							createdAt: false,
							updatedAt: false,
							deletedAt: false,
						},
						with: {
							tag: true,
						},
					},
				},
				where: sql`${postsTable.id} = ${postId} and ${postsTable.deletedAt} IS NULL`,
			})
			if (!res) {
				throw new HTTPException(404, {
					message: 'Post not found',
				})
			}
			return res
		})
	}

	async getByUserId(c: Context, userId: string) {
		return withDbConnection(c, async (db) => {
			const res = await db
				.select()
				.from(postsTable)
				.where(
					sql`${postsTable.userId} = ${userId} and ${postsTable.deletedAt} IS NULL`
				)
			return res
		})
	}
	async create(c: Context, body: PostInputSchema) {
		return withDbConnection(c, async (db) => {
			const [res] = await db
				.insert(postsTable)
				.values({ updatedAt: sql`NOW()`, ...body })
				.returning({ id: postsTable.id })
			return res
		})
	}
	async updateByPostId(c: Context, postId: string, body: PostInputSchema) {
		return withDbConnection(c, async (db) => {
			const [res] = await db
				.update(postsTable)
				.set({
					updatedAt: sql`NOW()`,
					...body,
				})
				.where(sql`${postsTable.id} = ${postId}`)
				.returning({ id: postsTable.id })
			return res
		})
	}

	async deleteByPostId(c: Context, postId: string) {
		return withDbConnection(c, async (db) => {
			const [res] = await db
				.update(postsTable)
				.set({ deletedAt: sql`NOW()`, updatedAt: sql`NOW()` })
				.where(sql`${postsTable.id} = ${postId}`)
				.returning({ id: postsTable.id })
			return res
		})
	}
}

export const postRepo = new PostRepository()
