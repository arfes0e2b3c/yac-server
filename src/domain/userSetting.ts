import { HTTPException } from 'hono/http-exception'
import { UserSettingSchema } from '../../openapi/userSetting'

class UserSettingDomain {
	checkFieldsNotNull(
		body: {
			[T in keyof Partial<UserSettingSchema>]: UserSettingSchema[T] | null
		}
	) {
		if (body.notificationEnabled == null) {
			throw new HTTPException(500, {
				message: 'notification_enabled is needed to not be null',
			})
		}
		if (body.notificationTime == null) {
			throw new HTTPException(500, {
				message: 'notification_time is needed to not be null',
			})
		}
		return true
	}
}
export const userSettingDomain = new UserSettingDomain()
