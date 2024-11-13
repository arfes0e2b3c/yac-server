import { eq, ilike, sql } from 'drizzle-orm'
import { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { MediaItemInputSchema } from '../../openapi/mediaItem'
import { withDbConnection } from '../db/connection'
import { mediaItemsTable } from '../db/schema/mediaItems'

class MediaItemRepository {
	async getAll(c: Context) {
		return withDbConnection(c, async (db) => {
			return await db.query.mediaItemsTable.findMany({
				with: {
					posts: true,
				},
				where: sql`${mediaItemsTable.deletedAt} IS NULL`,
			})
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
	async getBySearch(c: Context, q: string) {
		return withDbConnection(c, async (db) => {
			return await db
				.select()
				.from(mediaItemsTable)
				.where(ilike(mediaItemsTable.title, `%${q}%`))
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
}

export const mediaItemRepo = new MediaItemRepository()
