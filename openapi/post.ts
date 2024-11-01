import { createRoute, z } from '@hono/zod-openapi'
import { zDate, zString } from './common'

export const postSchema = z.object({
	id: zString('01J8F3RR15SSSVV2F3AGMJ4ZE7'),
	title: zString('タイトル'),
	content: zString('本文'),
	locationLabel: zString('場所名').nullable(),
	locationPoint: z.tuple([z.number(), z.number()]).nullable(),
	music: zString('01J8F3CJR0NJM89W64KYWSEJVA').nullable(),
	imageUrl: zString('https://example.com/image.jpg').nullable(),
	relatedUrl: zString('https://example.com/related').nullable(),
	visibility: z.enum(['private', 'public', 'only_followers']),
	createdAt: zDate('2024-09-23 07:57:06'),
	updatedAt: zDate('2024-09-23 07:57:06'),
	deletedAt: zDate('2024-09-23 07:57:06').nullable(),
})

export const postListSchema = z.object({ posts: z.array(postSchema) })
export const postDetailSchema = z.object({ post: postSchema })

const postInputSchema = z.object({
	title: zString('タイトル'),
	content: zString('本文'),
	locationLabel: zString('場所名').nullable(),
	locationPoint: z.tuple([z.number(), z.number()]).nullable(),
	music: zString('01J8F3CJR0NJM89W64KYWSEJVA').nullable(),
	imageUrl: zString('https://example.com/image.jpg').nullable(),
	relatedUrl: zString('https://example.com/related').nullable(),
	userId: zString('01J8F3CJR0NJM89W64KYWSEJVA'),
	mediaItemId: zString('01J8F3CJR0NJM89W64KYWSEJVA').nullable(),
	visibility: z.enum(['private', 'public', 'only_followers']),
})

export type PostSchema = z.infer<typeof postSchema>
export type PostListSchema = z.infer<typeof postListSchema>
export type PostInputSchema = z.infer<typeof postInputSchema>

export const fetchPostListRoute = createRoute({
	path: '/posts',
	method: 'get',
	description: '投稿一覧を取得する',
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
	request: {
		params: z.object({
			userId: zString('01J8F3CJR0NJM89W64KYWSEJVA'),
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

export const fetchPostDetailRoute = createRoute({
	path: '/posts/{postId}',
	method: 'get',
	description: '投稿詳細を取得する',
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
