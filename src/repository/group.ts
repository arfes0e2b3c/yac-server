import { count, sql } from 'drizzle-orm'
import { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { GroupInputSchema } from '../../openapi/group'
import { withDbConnection } from '../db/connection'
import { groupsTable } from '../db/schema/groups'

class GroupRepository {
	async getByUserId(c: Context, userId: string, limit: number, offset: number) {
		return withDbConnection(c, async (db) => {
			const groupRes = await db.query.groupsTable.findMany({
				where: sql`${groupsTable.userId} = ${userId} and ${groupsTable.deletedAt} IS NULL`,
				limit,
				offset,
			})
			const [groupCount] = await db
				.select({ count: count() })
				.from(groupsTable)
				.where(
					sql`${groupsTable.userId} = ${userId} and ${groupsTable.deletedAt} IS NULL`
				)
			return { res: groupRes, totalCount: groupCount.count }
		})
	}
	async getById(c: Context, groupId: string) {
		return withDbConnection(c, async (db) => {
			const res = await db.query.groupsTable.findFirst({
				with: {
					user: true,
				},
				where: sql`${groupsTable.id} = ${groupId} and ${groupsTable.deletedAt} IS NULL`,
			})
			if (!res) {
				throw new HTTPException(404, {
					message: 'Group not found',
				})
			}
			return res
		})
	}
	async create(c: Context, body: GroupInputSchema) {
		return withDbConnection(c, async (db) => {
			const [res] = await db
				.insert(groupsTable)
				.values(body)
				.returning({ id: groupsTable.id })
			return res
		})
	}
	async updateByGroupId(c: Context, groupId: string, body: GroupInputSchema) {
		return withDbConnection(c, async (db) => {
			const [res] = await db
				.update(groupsTable)
				.set({
					updatedAt: sql`NOW()`,
					...body,
				})
				.where(sql`${groupsTable.id} = ${groupId}`)
				.returning({ id: groupsTable.id })
			return res
		})
	}
	async deleteByGroupId(c: Context, groupId: string) {
		return withDbConnection(c, async (db) => {
			const [res] = await db
				.update(groupsTable)
				.set({ deletedAt: sql`NOW()`, updatedAt: sql`NOW()` })
				.where(sql`${groupsTable.id} = ${groupId}`)
				.returning({ id: groupsTable.id })
			return res
		})
	}
}

export const groupRepo = new GroupRepository()
