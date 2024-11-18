import { createRoute, z } from '@hono/zod-openapi'
import { zDate, zNum, zString } from './common'
import { mediaItemSchema } from './mediaItem'

export const postSchema = z.object({
	id: zString('01J8F3RR15SSSVV2F3AGMJ4ZE7'),
	content: zString('本文'),
	locationLabel: zString('場所名').nullable(),
	locationPoint: z.tuple([z.number(), z.number()]).nullable(),
	imageUrl: zString('https://example.com/image.jpg').nullable(),
	relatedUrl: zString('https://example.com/related').nullable(),
	visibility: z.enum(['private', 'public', 'only_followers']),
	date: zDate('2024-09-23 07:57:07').nullable(),
	createdAt: zDate('2024-09-23 07:57:06'),
	updatedAt: zDate('2024-09-23 07:57:06'),
	deletedAt: zDate('2024-09-23 07:57:06').nullable(),
})

export const postListSchema = z.object({
	posts: z.array(postSchema),
})

export const postListWithMediaItemSchema = z.object({
	posts: z.array(
		postSchema.extend({
			mediaItem: mediaItemSchema.nullable(),
		})
	),
	limit: zNum(10),
	offset: zNum(0),
	totalCount: zNum(100),
})

export const postDetailSchema = z.object({
	post: postSchema.extend({
		mediaItem: mediaItemSchema.nullable(),
	}),
})

const postInputSchema = z.object({
	content: zString('本文'),
	locationLabel: zString('場所名').nullable(),
	locationPoint: z.tuple([z.number(), z.number()]).nullable(),
	imageUrl: zString('https://example.com/image.jpg').nullable(),
	relatedUrl: zString('https://example.com/related').nullable(),
	userId: zString('01J8F3CJR0NJM89W64KYWSEJVA'),
	mediaItemId: zString('01J8F3CJR0NJM89W64KYWSEJVA').nullable(),
	visibility: z.enum(['private', 'public', 'only_followers']),
	date: z.coerce.date(),
})

export type PostSchema = z.infer<typeof postSchema>
export type PostListWithMediaitemSchema = z.infer<
	typeof postListWithMediaItemSchema
>
export type PostDetailSchema = z.infer<typeof postDetailSchema>
export type PostInputSchema = z.infer<typeof postInputSchema>

export const fetchPostListRoute = createRoute({
	path: '/posts',
	method: 'get',
	description: '投稿一覧を取得する',
	operationId: 'fetchPostList',
	request: {
		query: z.object({
			limit: zString('10').default('10'),
			offset: zString('0').default('0'),
		}),
	},
	responses: {
		200: {
			description: '投稿一覧',
			content: {
				'application/json': {
					schema: postListWithMediaItemSchema,
				},
			},
		},
	},
})

export const fetchPostListInRegionRoute = createRoute({
	path: '/posts/region',
	method: 'get',
	description: '地図上で選択された範囲の投稿一覧を取得する',
	operationId: 'fetchPostListInRegion',
	request: {
		query: z.object({
			limit: zString('10').default('10'),
			minLat: zString('35.658034'),
			maxLat: zString('35.758034'),
			minLng: zString('139.701636'),
			maxLng: zString('139.801636'),
		}),
	},
	responses: {
		200: {
			description: '投稿一覧',
			content: {
				'application/json': {
					schema: postListSchema,
				},
			},
		},
	},
})

export const fetchUserPostListRoute = createRoute({
	path: '/users/{userId}/posts',
	method: 'get',
	description: 'ユーザーの投稿一覧を取得する',
	operationId: 'fetchUserPostList',
	request: {
		params: z.object({
			userId: zString('01J8F3CJR0NJM89W64KYWSEJVA'),
		}),
		query: z.object({
			limit: z.string().default('10'),
			offset: z.string().default('0'),
		}),
	},
	responses: {
		200: {
			description: 'ユーザーの投稿一覧',
			content: {
				'application/json': {
					schema: postListWithMediaItemSchema,
				},
			},
		},
	},
})

export const fetchUserPostListInRegionRoute = createRoute({
	path: '/users/{userId}/posts/region',
	method: 'get',
	description: '地図上で選択された範囲のユーザーの投稿一覧を取得する',
	operationId: 'fetchUserPostListInRegion',
	request: {
		params: z.object({
			userId: zString('01J8F3CJR0NJM89W64KYWSEJVA'),
		}),
		query: z.object({
			limit: zString('10').default('10'),
			minLat: zString('35.658034'),
			maxLat: zString('35.758034'),
			minLng: zString('139.701636'),
			maxLng: zString('139.801636'),
		}),
	},
	responses: {
		200: {
			description: 'ユーザーの投稿一覧',
			content: {
				'application/json': {
					schema: postListSchema,
				},
			},
		},
	},
})

export const fetchMediaItemPostListRoute = createRoute({
	path: '/mediaItems/{mediaItemId}/posts',
	method: 'get',
	description: 'コンテンツに紐づく投稿一覧を取得する',
	operationId: 'fetchMediaItemPostList',
	request: {
		query: z.object({
			limit: zString('10').default('10'),
			offset: zString('0').default('0'),
		}),
		params: z.object({
			mediaItemId: zString('01J8F3CJR0NJM89W64KYWSEJVA'),
		}),
	},
	responses: {
		200: {
			description: 'コンテンツに紐づく投稿一覧',
			content: {
				'application/json': {
					schema: postListSchema,
				},
			},
		},
	},
})

export const fetchPostDetailRoute = createRoute({
	path: '/posts/{postId}',
	method: 'get',
	description: '投稿詳細を取得する',
	operationId: 'fetchPostDetail',
	request: {
		params: z.object({
			postId: zString('01J8F3CJR0NJM89W64KYWSEJVA'),
		}),
	},
	responses: {
		200: {
			description: '投稿詳細',
			content: {
				'application/json': {
					schema: postDetailSchema,
				},
			},
		},
	},
})

export const createPostRoute = createRoute({
	path: '/posts',
	method: 'post',
	description: '投稿を新規追加する',
	operationId: 'createPost',
	request: {
		body: {
			required: true,
			content: {
				'application/json': {
					schema: postInputSchema,
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

export const updatePostRoute = createRoute({
	path: '/posts/{postId}',
	method: 'patch',
	description: '投稿情報を更新する',
	operationId: 'updatePost',
	request: {
		body: {
			required: true,
			content: {
				'application/json': {
					schema: postInputSchema,
				},
			},
		},
		params: z.object({
			postId: zString('01J8F3CJR0NJM89W64KYWSEJVA'),
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

export const deletePostRoute = createRoute({
	path: '/posts/{postId}',
	method: 'delete',
	description: '投稿を論理削除する',
	operationId: 'deletePost',
	request: {
		params: z.object({
			postId: zString('01J8F3CJR0NJM89W64KYWSEJVA'),
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
