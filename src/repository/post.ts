import { count, desc, eq, sql } from 'drizzle-orm'
import { Context } from 'hono'
import { env as getEnv } from 'hono/adapter'
import { HTTPException } from 'hono/http-exception'
import {
	CreatePostInputSchema,
	InfiniteBaseQueryWithDateSchema,
	PostInputSchema,
} from '../../openapi/post'
import { withDbConnection } from '../db/connection'
import { postTagsTable } from '../db/schema/postTags'
import { PostsTableVisibility, postsTable } from '../db/schema/posts'
import { ReneEnv } from '../types'

class PostRepository {
	async getAll(c: Context) {
		const cryptKey = getEnv<ReneEnv>(c).POST_CONTENT_CRYPT_KEY
		return withDbConnection(c, async (db) => {
			const where = sql`${postsTable.deletedAt} IS NULL`
			const postRes = await db.query.postsTable.findMany({
				columns: {
					userId: false,
					mediaItemId: false,
				},
				extras: {
					content:
						sql`pgp_sym_decrypt(${postsTable.encryptContent}, ${cryptKey})::text`.as(
							'content'
						),
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
				where,
			})
			const countRes = await db
				.select({ count: count() })
				.from(postsTable)
				.where(where)

			return { res: postRes, totalCount: countRes[0].count }
		})
	}

	async getAllInRegion(
		c: Context,
		limit: number,
		minLat: number,
		maxLat: number,
		minLng: number,
		maxLng: number
	) {
		const cryptKey = getEnv<ReneEnv>(c).POST_CONTENT_CRYPT_KEY
		return withDbConnection(c, async (db) => {
			const x = await db.query.postsTable.findMany({
				with: {
					postLikes: {
						columns: {
							postId: false,
							createdAt: false,
							updatedAt: false,
							deletedAt: false,
						},
					},
				},
				extras: {
					content:
						sql`pgp_sym_decrypt(${postsTable.encryptContent}, ${cryptKey})::text`.as(
							'content'
						),
				},
				columns: {
					mediaItemId: false,
				},
				orderBy: [desc(postsTable.date), desc(postsTable.createdAt)],
				where: sql`${postsTable.deletedAt} IS NULL and ${postsTable.locationPoint} <@ box(point(${minLat}, ${minLng}), point(${maxLat}, ${maxLng})) and ${postsTable.visibility} = ${PostsTableVisibility.PUBLIC}`,
				limit,
			})
			return x
		})
	}

	async getByPostId(c: Context, postId: string) {
		const cryptKey = getEnv<ReneEnv>(c).POST_CONTENT_CRYPT_KEY

		return withDbConnection(c, async (db) => {
			const res = await db.query.postsTable.findFirst({
				columns: {
					mediaItemId: false,
				},
				extras: {
					content:
						sql`pgp_sym_decrypt(${postsTable.encryptContent}, ${cryptKey})::text`.as(
							'content'
						),
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

	async getByUserId(
		c: Context,
		userId: string,
		query: InfiniteBaseQueryWithDateSchema
	) {
		const { startDate, endDate, limit, offset } = query
		const cryptKey = getEnv<ReneEnv>(c).POST_CONTENT_CRYPT_KEY

		return withDbConnection(c, async (db) => {
			const where = sql`${postsTable.userId} = ${userId} and ${postsTable.deletedAt} IS NULL`
			if (startDate !== '' && endDate !== '') {
				where.append(
					sql` and ${postsTable.date} >= ${startDate} and ${postsTable.date} <= ${endDate}`
				)
			}
			const postRes = await db.query.postsTable.findMany({
				columns: {
					userId: false,
					mediaItemId: false,
				},
				extras: {
					content:
						sql`pgp_sym_decrypt(${postsTable.encryptContent}, ${cryptKey})::text`.as(
							'content'
						),
				},
				with: {
					// user: true,
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
				orderBy: [desc(postsTable.date), desc(postsTable.createdAt)],
				where,
				limit,
				offset,
			})
			console.log(postRes[0].content)
			const [countRes] = await db
				.select({ count: count() })
				.from(postsTable)
				.where(where)
			return { res: postRes, totalCount: countRes.count }
		})
	}

	async getByUserIdInRegion(
		c: Context,
		limit: number,
		userId: string,
		minLat: number,
		maxLat: number,
		minLng: number,
		maxLng: number
	) {
		const cryptKey = getEnv<ReneEnv>(c).POST_CONTENT_CRYPT_KEY

		return withDbConnection(c, async (db) => {
			return await db.query.postsTable.findMany({
				columns: {
					mediaItemId: false,
				},
				extras: {
					content:
						sql`pgp_sym_decrypt(${postsTable.encryptContent}, ${cryptKey})::text`.as(
							'content'
						),
				},
				orderBy: [desc(postsTable.date), desc(postsTable.createdAt)],
				where: sql`${postsTable.userId} = ${userId} and ${postsTable.deletedAt} IS NULL and ${postsTable.locationPoint} <@ box(point(${minLat}, ${minLng}), point(${maxLat}, ${maxLng}))`,
				limit,
			})
		})
	}

	async getBySearch(
		c: Context,
		userId: string,
		q: string,
		startDate: string,
		endDate: string,
		limit: number,
		offset: number
	) {
		const cryptKey = getEnv<ReneEnv>(c).POST_CONTENT_CRYPT_KEY

		return withDbConnection(c, async (db) => {
			const where = sql`${postsTable.userId} = ${userId} and ${postsTable.deletedAt} IS NULL and ${postsTable.content} ILIKE ${`%${q}%`}`
			if (startDate && endDate) {
				where.append(
					sql` and ${postsTable.date} >= ${startDate} and ${postsTable.date} <= ${endDate}`
				)
			}
			const postRes = await db.query.postsTable.findMany({
				columns: {
					userId: false,
					mediaItemId: false,
				},
				with: {
					mediaItem: true,
				},
				extras: {
					content:
						sql`pgp_sym_decrypt(${postsTable.encryptContent}, ${cryptKey})::text`.as(
							'content'
						),
				},
				orderBy: [desc(postsTable.date), desc(postsTable.createdAt)],
				where,
				limit,
				offset,
			})
			const [countRes] = await db
				.select({ count: count() })
				.from(postsTable)
				.where(where)
			return { res: postRes, totalCount: countRes.count }
		})
	}

	async getByMediaItemId(
		c: Context,
		limit: number,
		offset: number,
		mediaItemId: string
	) {
		const cryptKey = getEnv<ReneEnv>(c).POST_CONTENT_CRYPT_KEY

		return withDbConnection(c, async (db) => {
			const where = sql`${postsTable.mediaItemId} = ${mediaItemId} and ${postsTable.deletedAt} IS NULL and ${postsTable.visibility} = ${PostsTableVisibility.PUBLIC}`
			const postRes = await db.query.postsTable.findMany({
				columns: {
					userId: false,
				},
				extras: {
					content:
						sql`pgp_sym_decrypt(${postsTable.encryptContent}, ${cryptKey})::text`.as(
							'content'
						),
				},
				with: {
					mediaItem: true,
					postLikes: {
						columns: {
							postId: false,
							createdAt: false,
							updatedAt: false,
							deletedAt: false,
						},
					},
				},
				orderBy: [desc(postsTable.date), desc(postsTable.createdAt)],
				where,
				limit,
				offset,
			})
			const [countRes] = await db
				.select({ count: count() })
				.from(postsTable)
				.where(where)
			return { res: postRes, totalCount: countRes.count }
		})
	}

	async getByUserTagId(
		c: Context,
		userId: string,
		tagId: string,
		limit: number,
		offset: number
	) {
		const cryptKey = getEnv<ReneEnv>(c).POST_CONTENT_CRYPT_KEY
		return withDbConnection(c, async (db) => {
			const where = sql`${postTagsTable.tagId} = ${tagId} and ${postsTable.deletedAt} IS NULL`

			const postRes = await db.query.postTagsTable.findMany({
				columns: {
					postId: false,
					tagId: false,
					createdAt: false,
					updatedAt: false,
					deletedAt: false,
				},
				extras: {
					content:
						sql`pgp_sym_decrypt(${postsTable.encryptContent}, ${cryptKey})::text`.as(
							'content'
						),
				},
				with: {
					post: {
						columns: {
							mediaItemId: false,
						},
						with: {
							mediaItem: true,
						},
					},
				},
				where,
				limit,
				offset,
			})
			const postList = postRes
				.map((item) => item.post)
				.filter((item) => item.deletedAt === null && item.userId === userId)
			const [countRes] = await db
				.select({ count: count() })
				.from(postTagsTable)
				.innerJoin(postsTable, eq(postTagsTable.postId, postsTable.id))
				.where(where)
			return { res: postList, totalCount: countRes.count }
		})
	}

	async create(c: Context, body: CreatePostInputSchema['post'], score: number) {
		const cryptKey = getEnv<ReneEnv>(c).POST_CONTENT_CRYPT_KEY
		return withDbConnection(c, async (db) => {
			const [res] = await db
				.insert(postsTable)
				.values({
					updatedAt: sql`NOW()`,
					score,
					...body,
					content: sql`pgp_sym_encrypt(${body.content}, ${cryptKey})::bytea`,
				})
				.returning({ id: postsTable.id })
			return res
		})
	}
	async updateByPostId(c: Context, postId: string, body: PostInputSchema) {
		const cryptKey = getEnv<ReneEnv>(c).POST_CONTENT_CRYPT_KEY

		return withDbConnection(c, async (db) => {
			const [res] = await db
				.update(postsTable)
				.set({
					updatedAt: sql`NOW()`,
					...body,
					content: sql`pgp_sym_encrypt(${body.content}, ${cryptKey})::bytea`,
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
