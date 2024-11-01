import { createRoute, z } from '@hono/zod-openapi'
import { zDate, zNum, zString } from './common'
import { postSchema } from './post'

export const mediaItemSchema = z.object({
	id: zString('01J8F3RR15SSSVV2F3AGMJ4ZE7').max(26),
	title: zString('タイトル').max(255),
	imageUrl: zString('https://sample.com'),
	relationCount: zNum(12),
	posts: z.array(postSchema),
	createdAt: zDate('2024-09-23 07:57:06'),
	updatedAt: zDate('2024-09-23 07:57:06'),
	deletedAt: zDate('2024-09-23 07:57:06').nullable(),
})

const mediaItemDetailSchema = z.object({
	mediaItem: mediaItemSchema,
})

const mediaItemInputSchema = z.object({
	title: zString('タイトル').max(255),
	imageUrl: zString('http://example.com').max(26),
})

const mediaItemListSchema = z.object({ mediaItems: z.array(mediaItemSchema) })

export type MediaItemSchema = z.infer<typeof mediaItemSchema>
export type MediaItemListSchema = z.infer<typeof mediaItemListSchema>
export type MediaItemInputSchema = z.infer<typeof mediaItemInputSchema>

export const fetchMediaItemListRoute = createRoute({
	path: '/mediaItems',
	method: 'get',
	description: 'コンテンツ一覧を取得する',
	responses: {
		200: {
			description: 'コンテンツ一覧',
			content: {
				'application/json': {
					schema: mediaItemListSchema,
				},
			},
		},
	},
})

export const fetchMediaItemDetailRoute = createRoute({
	path: '/mediaItems/{mediaItemId}',
	method: 'get',
	description: 'コンテンツ詳細を取得する',
	request: {
		params: z.object({
			mediaItemId: zString('01J8F3CJR0NJM89W64KYWSEJVA'),
		}),
	},
	responses: {
		200: {
			description: 'コンテンツ詳細',
			content: {
				'application/json': {
					schema: mediaItemDetailSchema,
				},
			},
		},
	},
})

export const createMediaItemRoute = createRoute({
	path: '/',
	method: 'post',
	description: 'コンテンツを新規追加する',
	request: {
		body: {
			required: true,
			content: {
				'application/json': {
					schema: mediaItemInputSchema,
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

export const updateMediaItemRoute = createRoute({
	path: '/mediaItems/{mediaItemId}',
	method: 'patch',
	description: 'コンテンツ情報を更新する',
	request: {
		body: {
			required: true,
			content: {
				'application/json': {
					schema: mediaItemInputSchema,
				},
			},
		},
		params: z.object({
			mediaItemId: zString('01J8F3CJR0NJM89W64KYWSEJVA'),
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

export const deleteMediaItemRoute = createRoute({
	path: '/{mediaItemId}',
	method: 'delete',
	description: 'コンテンツを論理削除する',
	request: {
		params: z.object({
			mediaItemId: zString('01J8F3CJR0NJM89W64KYWSEJVA'),
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
