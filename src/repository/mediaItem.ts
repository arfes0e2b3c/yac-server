import { count, desc, eq, ilike, sql } from 'drizzle-orm'
import { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { MediaItemInputSchema } from '../../openapi/mediaItem'
import { withDbConnection } from '../db/connection'
import { mediaItemsTable } from '../db/schema/mediaItems'
import { postsTable } from '../db/schema/posts'

class MediaItemRepository {
	async getAll(c: Context, limit: number, offset: number) {
		const where = sql`${mediaItemsTable.deletedAt} IS NULL`
		return withDbConnection(c, async (db) => {
			const mediaItemRes = await db.query.mediaItemsTable.findMany({
				where,
				limit,
				offset,
				orderBy: [desc(mediaItemsTable.relationCount)],
			})
			const [countRes] = await db
				.select({ count: count() })
				.from(mediaItemsTable)
				.where(where)
			return { res: mediaItemRes, totalCount: countRes.count }
		})
	}
	async getById(c: Context, mediaItemId: string) {
		return withDbConnection(c, async (db) => {
			const res = await db.query.mediaItemsTable.findFirst({
				with: {
					posts: true,
				},
				where: sql`${mediaItemsTable.id} = ${mediaItemId} and ${mediaItemsTable.deletedAt} IS NULL`,
			})
			if (!res) {
				throw new HTTPException(404, {
					message: 'MediaItem not found',
				})
			}
			return res
		})
	}
	async getBySearch(c: Context, q: string, limit: number, offset: number) {
		const where = ilike(mediaItemsTable.title, `%${q}%`)
		return withDbConnection(c, async (db) => {
			const mediaItemRes = await db
				.select()
				.from(mediaItemsTable)
				.where(where)
				.limit(limit)
				.offset(offset)
				.orderBy(desc(mediaItemsTable.relationCount))
			const [countRes] = await db
				.select({ count: count() })
				.from(mediaItemsTable)
				.where(where)
			return { res: mediaItemRes, totalCount: countRes.count }
		})
	}
	async create(c: Context, body: MediaItemInputSchema) {
		return withDbConnection(c, async (db) => {
			const [res] = await db
				.insert(mediaItemsTable)
				.values(body)
				.returning({ id: mediaItemsTable.id })
			return res
		})
	}
	async updateByMediaItemId(
		c: Context,
		mediaItemId: string,
		body: MediaItemInputSchema
	) {
		return withDbConnection(c, async (db) => {
			const [res] = await db
				.update(mediaItemsTable)
				.set({
					updatedAt: sql`NOW()`,
					...body,
				})
				.where(sql`${mediaItemsTable.id} = ${mediaItemId}`)
				.returning({ id: mediaItemsTable.id })
			return res
		})
	}
	async deleteByMediaItemId(c: Context, mediaItemId: string) {
		return withDbConnection(c, async (db) => {
			const [res] = await db
				.update(mediaItemsTable)
				.set({ deletedAt: sql`NOW()`, updatedAt: sql`NOW()` })
				.where(sql`${mediaItemsTable.id} = ${mediaItemId}`)
				.returning({ id: mediaItemsTable.id })
			return res
		})
	}
	async countMediaItemRelations(c: Context) {
		return withDbConnection(c, async (db) => {
			await db.update(mediaItemsTable).set({
				relationCount: sql`${db
					.select({
						count: count(),
					})
					.from(postsTable)
					.where(eq(postsTable.mediaItemId, mediaItemsTable.id))}`,
				updatedAt: sql`NOW()`,
			})
			return true
		})
	}
}

export const mediaItemRepo = new MediaItemRepository()
