import { Context } from 'hono'

class NotificationRepository {
	async sendDraftNotification(c: Context, deviceTokens: string[]) {
		const message = (token: string) => ({
			to: token,
			sound: 'default',
			title: '投稿されていない下書きがあります',
			body: '忘れないうちにきもちを残しておきませんか？',
			data: { someData: 'goes here' },
		})
		const bactchSize = 100
		deviceTokens.push('ExponentPushToken[jLXWuyD03p5Xk1u8gWffRC]')
		console.log('deviceTokens2!', deviceTokens)

		for (let i = 0; i < deviceTokens.length / bactchSize; i++) {
			const batchTokens = deviceTokens.slice(
				i * bactchSize,
				(i + 1) * bactchSize
			)
			Promise.all(
				batchTokens.map(async (token) => {
					console.log('token', token)
					return await fetch('https://exp.host/--/api/v2/push/send', {
						method: 'POST',
						headers: {
							Accept: 'application/json',
							'Accept-encoding': 'gzip, deflate',
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(message(token)),
					})
				})
			)
		}
		console.log('notification sent')
	}
}

export const notificationRepo = new NotificationRepository()
