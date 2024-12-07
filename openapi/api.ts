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

export const generatePresignedUrlRoute = createRoute({
	path: '/generatePresignedUrl',
	method: 'get',
	description: 'S3の署名付きURLを生成する',
	operationId: 'generatePresignedUrl',
	responses: {
		200: {
			description: '成功',
			content: {
				'application/json': {
					schema: z.object({
						url: zString('https://example.com'),
						key: zString('key'),
					}),
				},
			},
		},
	},
})
