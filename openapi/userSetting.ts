import { createRoute, z } from '@hono/zod-openapi'
import { zDate, zString } from './common'

export const userSettingSchema = z.object({
	id: zString('01J8F3RR15SSSVV2F3AGMJ4ZE7').max(36),
	userId: zString('01J8F3CJR0NJM89W64KYWSEJVA'),
	deviceToken: zString('ExponentPushToken[xxxxx]').max(255).nullable(),
	notificationTime: zString('22:00').max(255).default('22:00'),
	notificationEnabled: z.boolean().default(true),
	createdAt: zDate('2024-09-23 07:57:06'),
	updatedAt: zDate('2024-09-23 07:57:06'),
})

const userSettingInputSchema = z
	.object({
		deviceToken: zString('ExponentPushToken[xxxxx]').max(255).nullable(),
		notificationTime: zString('22:00').max(255),
		notificationEnabled: z.boolean(),
	})
	.partial()

export type UserSettingSchema = z.infer<typeof userSettingSchema>
export type UserSettingInputSchema = z.infer<typeof userSettingInputSchema>

export const fetchUserSettingRoute = createRoute({
	path: '/userSettings/{userId}',
	method: 'get',
	description: 'ユーザー設定を取得する',
	operationId: 'fetchUserSetting',
	request: {
		params: z.object({
			userId: zString('01J8F3CJR0NJM89W64KYWSEJVA'),
		}),
	},
	responses: {
		200: {
			description: 'タグ一覧',
			content: {
				'application/json': {
					schema: userSettingSchema,
				},
			},
		},
	},
})

export const updateUserSettingRoute = createRoute({
	path: '/userSettings/{userId}',
	method: 'patch',
	description: 'ユーザー設定を更新する',
	operationId: 'updateUserSetting',
	request: {
		body: {
			required: true,
			content: {
				'application/json': {
					schema: userSettingInputSchema,
				},
			},
		},
		params: z.object({
			userId: zString('01J8F3CJR0NJM89W64KYWSEJVA'),
		}),
	},
	responses: {
		200: {
			description: 'OK',
			content: {
				'application/json': {
					schema: z.object({
						id: zString('01J8F3CJR0NJM89W64KYWSEJVA'),
					}),
				},
			},
		},
	},
})
