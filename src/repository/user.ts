import dayjs from 'dayjs'
import { eq, sql } from 'drizzle-orm'
import { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { UserInputSchema } from '../../openapi/user'
import { withDbConnection } from '../db/connection'
import { postsTable } from '../db/schema/posts'
import { userSettingsTable } from '../db/schema/userSettings'
import { usersTable } from '../db/schema/users'

class UserRepository {
	async getAll(c: Context) {
		return withDbConnection(c, async (db) => {
			return await db
				.select()
				.from(usersTable)
				.where(sql`${usersTable.deletedAt} IS NULL`)
		})
	}
	async getById(c: Context, userId: string) {
		return withDbConnection(c, async (db) => {
			const res = await db.query.usersTable.findFirst({
				with: {
					userSetting: {
						columns: {
							deviceToken: true,
							notificationEnabled: true,
							notificationTime: true,
						},
					},
				},
				where: sql`${usersTable.id} = ${userId} and ${usersTable.deletedAt} IS NULL`,
			})
			if (!res?.userSetting) {
				throw new HTTPException(500, { message: 'User setting is null' })
			}
			return res
		})
	}
	async getHasDraftUsers(c: Context, time: string) {
		const yesterday = dayjs()
			.subtract(1, 'd')
			.hour(Number(time.slice(0, 2)))
			.minute(Number(time.slice(3)))
			.startOf('minute')
		console.log('yesterday', yesterday)
		return withDbConnection(c, async (db) => {
			const rows = await db
				.select()
				.from(usersTable)
				.innerJoin(postsTable, eq(usersTable.id, postsTable.userId))
				.innerJoin(
					userSettingsTable,
					eq(usersTable.id, userSettingsTable.userId)
				)
				.where(
					sql`${postsTable.deletedAt} IS NULL and ${postsTable.isDraft} = true and ${postsTable.createdAt} > ${yesterday} and ${userSettingsTable.notificationEnabled} = true and ${userSettingsTable.notificationTime} = ${time}`
				)
			console.log('rows', rows)
			const res = rows.reduce<string[]>((acc, row) => {
				const userSetting = row.user_settings
				if (
					!acc.find((a) => a === userSetting.deviceToken) &&
					userSetting.deviceToken
				) {
					acc.push(userSetting.deviceToken)
				}
				return acc
			}, [])
			console.log('deviceTokens', res)
			return res
		})
	}
	async create(c: Context, body: UserInputSchema) {
		return withDbConnection(c, async (db) => {
			const [res] = await db
				.insert(usersTable)
				.values(body)
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
