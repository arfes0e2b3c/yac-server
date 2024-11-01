import { sql } from 'drizzle-orm'
import { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { TagInputSchema } from '../../openapi/tag'
import { withDbConnection } from '../db/connection'
import { tagsTable } from '../db/schema/tags'

class TagRepository {
	async getAll(c: Context) {
		return withDbConnection(c, async (db) => {
			return await db.query.tagsTable.findMany({
				with: {
					user: true,
				},
				where: sql`${tagsTable.deletedAt} IS NULL`,
			})
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
