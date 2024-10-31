import { createRoute, z } from '@hono/zod-openapi'
import { zDate, zString } from './common'

export const userSchema = z.object({
	id: zString('01J8F3RR15SSSVV2F3AGMJ4ZE7'),
	userCode: zString('arfes0e2b3c').max(255),
	name: zString('名前').max(255),
	bio: zString('自己紹介').max(255).nullable(),
	lastLoginedAt: zDate('2024-09-23 07:57:06').nullable(),
	createdAt: zDate('2024-09-23 07:57:06'),
	updatedAt: zDate('2024-09-23 07:57:06'),
	deletedAt: zDate('2024-09-23 07:57:06').nullable(),
})

const userDetailSchema = z.object({
	user: userSchema,
})

const userInputSchema = z.object({
	userCode: zString('arfes0e2b3c').max(255),
	name: zString('名前').max(255),
	bio: zString('自己紹介').max(255),
})

const userListSchema = z.object({ users: z.array(userSchema) })

export type UserSchema = z.infer<typeof userSchema>
export type UserListSchema = z.infer<typeof userListSchema>
export type UserInputSchema = z.infer<typeof userInputSchema>

export const fetchUserListRoute = createRoute({
	path: '/users',
	method: 'get',
	description: 'ユーザー一覧を取得する',
	responses: {
		200: {
			description: 'ユーザー一覧',
			content: {
				'application/json': {
					schema: userListSchema,
				},
			},
		},
	},
})

export const fetchUserDetailRoute = createRoute({
	path: '/users/{userId}',
	method: 'get',
	description: 'ユーザー詳細を取得する',
	request: {
		params: z.object({
			userId: zString('01J8F3CJR0NJM89W64KYWSEJVA'),
		}),
	},
	responses: {
		200: {
			description: 'ユーザー詳細',
			content: {
				'application/json': {
					schema: userDetailSchema,
				},
			},
		},
	},
})

export const fetchMeRoute = createRoute({
	path: '/users/me',
	method: 'get',
	description: '認証ユーザー情報を取得する',
	request: {
		params: z.object({
			userId: zString('01J8F3CJR0NJM89W64KYWSEJVA'),
		}),
	},
	responses: {
		200: {
			description: 'ユーザー詳細',
			content: {
				'application/json': {
					schema: userDetailSchema,
				},
			},
		},
	},
})

export const createUserRoute = createRoute({
	path: '/',
	method: 'post',
	description: 'ユーザーを新規追加する',
	request: {
		body: {
			required: true,
			content: {
				'application/json': {
					schema: userInputSchema,
				},
			},
		},
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

export const updateUserRoute = createRoute({
	path: '/users/{userId}',
	method: 'patch',
	description: 'ユーザー情報を更新する',
	request: {
		body: {
			required: true,
			content: {
				'application/json': {
					schema: userInputSchema,
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

export const deleteUserRoute = createRoute({
	path: '/{userId}',
	method: 'delete',
	description: 'ユーザーを論理削除する',
	request: {
		params: z.object({
			userId: zString('01J8F3CJR0NJM89W64KYWSEJVA'),
		}),
	},
	responses: {
		200: {
			description: 'OK',
		},
		500: {
			description: 'Internal Server Err',
		},
	},
})
