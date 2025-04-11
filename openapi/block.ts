import { createRoute, z } from '@hono/zod-openapi'
import { zString } from './common'

export const blockSchema = zString('01J8F3CJR0NJM89W64KYWSEJVA')

export const blockListSchema = z.object({
	blocks: z.array(blockSchema),
})

export const blockInputSchema = z.object({
	userId: zString('01J8F3CJR0NJM89W64KYWSEJVA'),
	targetUserId: zString('01J8F3CJR0NJM89W64KYWSEJVA'),
})

export const createBlockRoute = createRoute({
	path: '/blocks',
	method: 'post',
	operationId: 'createBlock',
	description: 'ブロックする',
	request: {
		body: {
			required: true,
			content: {
				'application/json': {
					schema: blockInputSchema,
				},
			},
		},
	},
	responses: {
		200: {
			description: 'ブロック成功',
			content: {
				'application/json': {
					schema: blockSchema,
				},
			},
		},
	},
})
