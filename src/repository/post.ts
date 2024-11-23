import { count, desc, eq, sql } from 'drizzle-orm'
import { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { PostInputSchema } from '../../openapi/post'
import { withDbConnection } from '../db/connection'
import { postGroupsTable } from '../db/schema/postGroups'
import { PostsTableVisibility, postsTable } from '../db/schema/posts'

class PostRepository {
	async getAll(c: Context) {
		return withDbConnection(c, async (db) => {
			const where = sql`${postsTable.deletedAt} IS NULL`
			const postRes = await db.query.postsTable.findMany({
				columns: {
					userId: false,
					mediaItemId: false,
				},
				with: {
					user: true,
					mediaItem: true,
					postGroups: {
						columns: {
							postId: false,
							groupId: false,
							createdAt: false,
							updatedAt: false,
							deletedAt: false,
						},
						with: {
							group: true,
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
		return withDbConnection(c, async (db) => {
			return await db.query.postsTable.findMany({
				columns: {
					mediaItemId: false,
				},
				orderBy: [desc(postsTable.createdAt)],
				where: sql`${postsTable.deletedAt} IS NULL and ${postsTable.locationPoint} <@ box(point(${minLat}, ${minLng}), point(${maxLat}, ${maxLng})) and ${postsTable.visibility} = ${PostsTableVisibility.PUBLIC}`,
				limit,
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
					postGroups: {
						columns: {
							postId: false,
							groupId: false,
							createdAt: false,
							updatedAt: false,
							deletedAt: false,
						},
						with: {
							group: true,
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

	async getByUserId(c: Context, userId: string, limit: number, offset: number) {
		return withDbConnection(c, async (db) => {
			const where = sql`${postsTable.userId} = ${userId} and ${postsTable.deletedAt} IS NULL`
			const postRes = await db.query.postsTable.findMany({
				columns: {
					userId: false,
					mediaItemId: false,
				},
				with: {
					// user: true,
					mediaItem: true,
					// postGroups: {
					// 	columns: {
					// 		postId: false,
					// 		groupId: false,
					// 		createdAt: false,
					// 		updatedAt: false,
					// 		deletedAt: false,
					// 	},
					// 	with: {
					// 		group: true,
					// 	},
					// },
				},
				orderBy: [desc(postsTable.createdAt)],
				where: sql`${postsTable.userId} = ${userId} and ${postsTable.deletedAt} IS NULL`,
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

	async getByUserIdInRegion(
		c: Context,
		limit: number,
		userId: string,
		minLat: number,
		maxLat: number,
		minLng: number,
		maxLng: number
	) {
		return withDbConnection(c, async (db) => {
			return await db.query.postsTable.findMany({
				columns: {
					mediaItemId: false,
				},
				orderBy: [desc(postsTable.createdAt)],
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
		const today = new Date().toLocaleDateString()
		return withDbConnection(c, async (db) => {
			const where = sql`${postsTable.userId} = ${userId} and ${postsTable.deletedAt} IS NULL and ${postsTable.content} ILIKE ${`%${q}%`}`
			if (startDate !== today && endDate !== today) {
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
				orderBy: [desc(postsTable.createdAt)],
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
		return withDbConnection(c, async (db) => {
			const where = sql`${postsTable.mediaItemId} = ${mediaItemId} and ${postsTable.deletedAt} IS NULL`
			const postRes = await db.query.postsTable.findMany({
				columns: {
					userId: false,
				},
				with: {
					mediaItem: true,
				},
				orderBy: [desc(postsTable.createdAt)],
				where,
				limit,
				offset,
			})
			console.log(postRes)
			const [countRes] = await db
				.select({ count: count() })
				.from(postsTable)
				.where(where)
			return { res: postRes, totalCount: countRes.count }
		})
	}

	async getByUserGroupId(
		c: Context,
		userId: string,
		groupId: string,
		limit: number,
		offset: number
	) {
		return withDbConnection(c, async (db) => {
			const where = sql`${postGroupsTable.groupId} = ${groupId} and ${postsTable.deletedAt} IS NULL`
			// const postRes = await db
			// 	.select()
			// 	.from(postGroupsTable)
			// 	.innerJoin(
			// 		postsTable,
			// 		sql`${postGroupsTable.postId} = ${postsTable.id} and ${postsTable.userId} = ${userId} and ${postsTable.deletedAt} IS NULL`
			// 	)
			// 	.where(where)
			// 	.limit(limit)
			// 	.offset(offset)
			const postRes = await db.query.postGroupsTable.findMany({
				columns: {
					postId: false,
					groupId: false,
					createdAt: false,
					updatedAt: false,
					deletedAt: false,
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
				.from(postGroupsTable)
				.innerJoin(postsTable, eq(postGroupsTable.postId, postsTable.id))
				.where(where)
			return { res: postList, totalCount: countRes.count }
		})
	}

	async create(c: Context, body: PostInputSchema, score: number) {
		return withDbConnection(c, async (db) => {
			const [res] = await db
				.insert(postsTable)
				.values({ updatedAt: sql`NOW()`, score, ...body })
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
