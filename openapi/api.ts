import { createRoute, z } from '@hono/zod-openapi'
import { zNum, zString } from './common'

export const evaluateSentimentRoute = createRoute({
	path: '/evaluateSentiment',
	method: 'get',
	description: 'テキストの感情を評価する',
	operationId: 'evaluateSentiment',
	request: {
		query: z.object({
			text: zString('こんにちは'),
		}),
	},
	responses: {
		200: {
			description: '感情評価',
			content: {
				'application/json': {
					schema: zNum(0.1),
				},
			},
		},
	},
})
