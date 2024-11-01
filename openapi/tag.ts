import { createRoute, z } from '@hono/zod-openapi'
import { zDate, zString } from './common'
import { userSchema } from './user'

export const tagSchema = z.object({
	id: zString('01J8F3RR15SSSVV2F3AGMJ4ZE7').max(26),
	name: zString('タイトル').max(255),
	user: userSchema,
	createdAt: zDate('2024-09-23 07:57:06'),
	updatedAt: zDate('2024-09-23 07:57:06'),
	deletedAt: zDate('2024-09-23 07:57:06').nullable(),
})

const tagDetailSchema = z.object({
	tag: tagSchema,
})

const tagInputSchema = z.object({
	name: zString('タイトル').max(255),
	userId: zString('自己紹介').max(26),
})

const tagListSchema = z.object({ tags: z.array(tagSchema) })

export type TagSchema = z.infer<typeof tagSchema>
export type TagListSchema = z.infer<typeof tagListSchema>
export type TagInputSchema = z.infer<typeof tagInputSchema>

export const fetchTagListRoute = createRoute({
	path: '/tags',
	method: 'get',
	description: 'タグ一覧を取得する',
	responses: {
		200: {
			description: 'タグ一覧',
			content: {
				'application/json': {
					schema: tagListSchema,
				},
			},
		},
	},
})

export const fetchTagDetailRoute = createRoute({
	path: '/tags/{tagId}',
	method: 'get',
	description: 'タグ詳細を取得する',
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

export const createTagRoute = createRoute({
	path: '/tags',
	method: 'post',
	description: 'タグを新規追加する',
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
	path: '/{tagId}',
	method: 'delete',
	description: 'タグを論理削除する',
	request: {
		params: z.object({
			tagId: zString('01J8F3CJR0NJM89W64KYWSEJVA'),
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
