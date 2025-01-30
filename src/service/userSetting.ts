import { Context } from 'hono'
import { UserSettingInputSchema } from '../../openapi/userSetting'
import { userSettingRepo } from '../repository/userSetting'

class UserSettingService {
	async update(c: Context, userId: string, body: UserSettingInputSchema) {
		return await userSettingRepo.update(c, userId, body)
	}
}

export const userSettingSvc = new UserSettingService()
