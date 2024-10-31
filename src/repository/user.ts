import { sql } from 'drizzle-orm'
import { Context } from 'hono'
import { UserInputSchema } from '../../openapi/user'
import { withDbConnection } from '../db/connection'
import { postsTable } from '../db/schema/posts'
import { usersTable } from '../db/schema/users'

class UserRepository {
	async getAll(c: Context) {
		return withDbConnection(c, async (db) => {
			return await db
				.select()
				.from(usersTable)
				.where(sql`${usersTable.deletedAt} IS NULL`)
				.leftJoin(postsTable, sql`${postsTable.userId} = ${usersTable.id}`)
		})
	}
	async getById(c: Context, userId: string) {
		return withDbConnection(c, async (db) => {
			const [res] = await db
				.select()
				.from(usersTable)
				.where(
					sql`${usersTable.id} = ${userId} and ${usersTable.deletedAt} IS NULL`
				)
			return res
		})
	}
	async create(c: Context, body: UserInputSchema) {
		return withDbConnection(c, async (db) => {
			const [res] = await db
				.insert(usersTable)
				.values({ updatedAt: sql`NOW()`, ...body })
				.returning({ id: usersTable.id })
			return res
		})
	}
	async updateByUserId(c: Context, userId: string, body: UserInputSchema) {
		return withDbConnection(c, async (db) => {
			const [res] = await db
				.update(usersTable)
				.set({
					updatedAt: sql`NOW()`,
					...body,
				})
				.where(sql`${usersTable.id} = ${userId}`)
				.returning({ id: usersTable.id })
			return res
		})
	}
	async deleteByUserId(c: Context, userId: string) {
		return withDbConnection(c, async (db) => {
			const [res] = await db
				.update(usersTable)
				.set({ deletedAt: sql`NOW()`, updatedAt: sql`NOW()` })
				.where(sql`${usersTable.id} = ${userId}`)
				.returning({ id: usersTable.id })
			return res
		})
	}
}

export const userRepo = new UserRepository()
