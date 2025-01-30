import { sql } from 'drizzle-orm'
import { Context } from 'hono'
import { UserSettingInputSchema } from '../../openapi/userSetting'
import { withDbConnection } from '../db/connection'
import { userSettingsTable } from '../db/schema/userSettings'
import { filterUndefinedNullProperties } from '../helpers/object'

class UserSetting {
	async update(c: Context, userId: string, body: UserSettingInputSchema) {
		return withDbConnection(c, async (db) => {
			const [res] = await db
				.update(userSettingsTable)
				.set({
					...filterUndefinedNullProperties(body),
					updatedAt: sql`CURRENT_TIMESTAMP`,
				})
				.where(sql`${userSettingsTable.userId} = ${userId}`)
				.returning({ id: userSettingsTable.userId })
			return res
		})
	}
}

export const userSettingRepo = new UserSetting()
