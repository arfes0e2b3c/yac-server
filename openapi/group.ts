import { createRoute, z } from '@hono/zod-openapi'
import { zDate, zNum, zString } from './common'

export const groupSchema = z.object({
	id: zString('01J8F3RR15SSSVV2F3AGMJ4ZE7').max(36),
	name: zString('タイトル').max(255),
	userId: zString('01J8F3CJR0NJM89W64KYWSEJVA'),
	createdAt: zDate('2024-09-23 07:57:06'),
	updatedAt: zDate('2024-09-23 07:57:06'),
	deletedAt: zDate('2024-09-23 07:57:06').nullable(),
})

const groupDetailSchema = z.object({
	group: groupSchema,
})

const groupInputSchema = z.object({
	name: zString('タイトル').max(255),
	userId: zString('自己紹介'),
})

const groupListSchema = z.object({ groups: z.array(groupSchema) })

const groupListInfiniteSchema = z.object({
	groups: z.array(groupSchema),
	limit: zNum(10),
	offset: zNum(0),
	totalCount: zNum(100),
})

export type GroupSchema = z.infer<typeof groupSchema>
export type GroupListSchema = z.infer<typeof groupListSchema>
export type GroupInputSchema = z.infer<typeof groupInputSchema>

export const fetchUserGroupListRoute = createRoute({
	path: '/users/{userId}/groups',
	method: 'get',
	description: 'ユーザーのタグ一覧を取得する',
	operationId: 'fetchUserGroupList',
	request: {
		query: z.object({
			limit: zString('10').default('10'),
			offset: zString('0').default('0'),
		}),
		params: z.object({
			userId: zString('01J8F3CJR0NJM89W64KYWSEJVA'),
		}),
	},
	responses: {
		200: {
			description: 'タグ一覧',
			content: {
				'application/json': {
					schema: groupListInfiniteSchema,
				},
			},
		},
	},
})

export const fetchGroupDetailRoute = createRoute({
	path: '/groups/{groupId}',
	method: 'get',
	description: 'タグ詳細を取得する',
	operationId: 'fetchGroupDetail',
	request: {
		params: z.object({
			groupId: zString('01J8F3CJR0NJM89W64KYWSEJVA'),
		}),
	},
	responses: {
		200: {
			description: 'タグ詳細',
			content: {
				'application/json': {
					schema: groupDetailSchema,
				},
			},
		},
	},
})

export const createGroupRoute = createRoute({
	path: '/groups',
	method: 'post',
	description: 'タグを新規追加する',
	operationId: 'createGroup',
	request: {
		body: {
			required: true,
			content: {
				'application/json': {
					schema: groupInputSchema,
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

export const updateGroupRoute = createRoute({
	path: '/groups/{groupId}',
	method: 'patch',
	description: 'タグ情報を更新する',
	operationId: 'updateGroup',
	request: {
		body: {
			required: true,
			content: {
				'application/json': {
					schema: groupInputSchema,
				},
			},
		},
		params: z.object({
			groupId: zString('01J8F3CJR0NJM89W64KYWSEJVA'),
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

export const deleteGroupRoute = createRoute({
	path: '/{groupId}',
	method: 'delete',
	description: 'タグを論理削除する',
	operationId: 'deleteGroup',
	request: {
		params: z.object({
			groupId: zString('01J8F3CJR0NJM89W64KYWSEJVA'),
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
