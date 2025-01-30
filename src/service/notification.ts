import dayjs from 'dayjs'
import { Context } from 'hono'
import { floor } from '../helpers/dayjs'
import { repo } from '../repository'

dayjs.extend(floor)

class NotificationService {
	async registerExpoToken(c: Context, userId: string, token: string) {
		await repo.userSetting.update(c, userId, { deviceToken: token })
	}
	async sendDraftNotification(c: Context, time: string) {
		const flooredTime = dayjs(time).floor('minute', 30).format('HH:mm')
		console.log('flooredTime', flooredTime)
		const deviceTokens = await repo.user.getHasDraftUsers(c, flooredTime)
		await repo.notification.sendDraftNotification(c, deviceTokens)
	}
}

export const notificationSvc = new NotificationService()
