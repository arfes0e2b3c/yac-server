import { count, sql } from 'drizzle-orm'
import { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { TagInputSchema } from '../../openapi/tag'
import { withDbConnection } from '../db/connection'
import { tagsTable } from '../db/schema/tags'

class TagRepository {
	async getByUserId(c: Context, userId: string, limit: number, offset: number) {
		return withDbConnection(c, async (db) => {
			const tagRes = await db.query.tagsTable.findMany({
				where: sql`${tagsTable.userId} = ${userId} and ${tagsTable.deletedAt} IS NULL`,
				limit,
				offset,
			})
			const [tagCount] = await db
				.select({ count: count() })
				.from(tagsTable)
				.where(
					sql`${tagsTable.userId} = ${userId} and ${tagsTable.deletedAt} IS NULL`
				)
			return { res: tagRes, totalCount: tagCount.count }
		})
	}
	async getById(c: Context, tagId: string) {
		return withDbConnection(c, async (db) => {
			const res = await db.query.tagsTable.findFirst({
				with: {
					user: true,
				},
				where: sql`${tagsTable.id} = ${tagId} and ${tagsTable.deletedAt} IS NULL`,
			})
			if (!res) {
				throw new HTTPException(404, {
					message: 'Tag not found',
				})
			}
			return res
		})
	}
	async create(c: Context, body: TagInputSchema) {
		return withDbConnection(c, async (db) => {
			const [res] = await db
				.insert(tagsTable)
				.values(body)
				.returning({ id: tagsTable.id })
			return res
		})
	}
	async updateByTagId(c: Context, tagId: string, body: TagInputSchema) {
		return withDbConnection(c, async (db) => {
			const [res] = await db
				.update(tagsTable)
				.set({
					updatedAt: sql`NOW()`,
					...body,
				})
				.where(sql`${tagsTable.id} = ${tagId}`)
				.returning({ id: tagsTable.id })
			return res
		})
	}
	async deleteByTagId(c: Context, tagId: string) {
		return withDbConnection(c, async (db) => {
			const [res] = await db
				.update(tagsTable)
				.set({ deletedAt: sql`NOW()`, updatedAt: sql`NOW()` })
				.where(sql`${tagsTable.id} = ${tagId}`)
				.returning({ id: tagsTable.id })
			return res
		})
	}
}

export const tagRepo = new TagRepository()
