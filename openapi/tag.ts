import { createRoute, z } from '@hono/zod-openapi'
import { zDate, zNum, zString } from './common'

export const tagSchema = z.object({
	id: zString('01J8F3RR15SSSVV2F3AGMJ4ZE7').max(36),
	name: zString('タイトル').max(255),
	userId: zString('01J8F3CJR0NJM89W64KYWSEJVA'),
	createdAt: zDate('2024-09-23 07:57:06'),
	updatedAt: zDate('2024-09-23 07:57:06'),
	deletedAt: zDate('2024-09-23 07:57:06').nullable(),
})

const tagDetailSchema = z.object({
	tag: tagSchema,
})

const tagInputSchema = z.object({
	name: zString('タイトル').max(255),
	userId: zString('自己紹介'),
})

const tagListSchema = z.object({ tags: z.array(tagSchema) })

const tagListInfiniteSchema = z.object({
	tags: z.array(tagSchema),
	limit: zNum(10),
	offset: zNum(0),
	totalCount: zNum(100),
})

export type TagSchema = z.infer<typeof tagSchema>
export type TagListSchema = z.infer<typeof tagListSchema>
export type TagInputSchema = z.infer<typeof tagInputSchema>

export const fetchUserTagListRoute = createRoute({
	path: '/users/{userId}/tags',
	method: 'get',
	description: 'ユーザーのタグ一覧を取得する',
	operationId: 'fetchUserTagList',
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
					schema: tagListInfiniteSchema,
				},
			},
		},
	},
})

export const fetchTagDetailRoute = createRoute({
	path: '/tags/{tagId}',
	method: 'get',
	description: 'タグ詳細を取得する',
	operationId: 'fetchTagDetail',
	request: {
		params: z.object({
			tagId: zString('01J8F3CJR0NJM89W64KYWSEJVA'),
		}),
	},
	responses: {
		200: {
			description: 'タグ詳細',
			content: {
				'application/json': {
					schema: tagDetailSchema,
				},
			},
		},
	},
})

export const searchTagListRoute = createRoute({
	path: '/users/{userId}/tags/search',
	method: 'get',
	description: 'タグを検索する',
	operationId: 'searchTagList',
	request: {
		params: z.object({
			userId: zString('01J8F3CJR0NJM89W64KYWSEJVA'),
		}),
		query: z.object({
			q: zString('キーワード'),
			limit: zString('10').default('10'),
			offset: zString('0').default('0'),
		}),
	},
	responses: {
		200: {
			description: '検索結果',
			content: {
				'application/json': {
					schema: tagListSchema,
				},
			},
		},
	},
})

export const createTagRoute = createRoute({
	path: '/tags',
	method: 'post',
	description: 'タグを新規追加する',
	operationId: 'createTag',
	request: {
		body: {
			required: true,
			content: {
				'application/json': {
					schema: tagInputSchema,
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

export const updateTagRoute = createRoute({
	path: '/tags/{tagId}',
	method: 'patch',
	description: 'タグ情報を更新する',
	operationId: 'updateTag',
	request: {
		body: {
			required: true,
			content: {
				'application/json': {
					schema: tagInputSchema,
				},
			},
		},
		params: z.object({
			tagId: zString('01J8F3CJR0NJM89W64KYWSEJVA'),
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

export const deleteTagRoute = createRoute({
	path: '/tags',
	method: 'patch',
	description: 'タグを論理削除する',
	operationId: 'deleteTag',
	request: {
		body: {
			required: true,
			content: {
				'application/json': {
					schema: z.object({
						tagIds: z.array(zString('01J8F3CJR0NJM89W64KYWSEJVA')),
					}),
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
						tagIds: z.array(zString('01J8F3CJR0NJM89W64KYWSEJVA')),
					}),
				},
			},
		},
		500: {
			description: 'Internal Server Err',
		},
	},
})
