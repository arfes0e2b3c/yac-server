import { createRoute, z } from '@hono/zod-openapi'
import { zString } from './common'

const postLikeSchema = z.object({
	userId: zString('01J8F3RR15SSSVV2F3AGMJ4ZE7'),
	postId: zString('01J8F3RR15SSSVV2F3AGMJ4ZE7'),
})

export type PostLikeSchema = z.infer<typeof postLikeSchema>

const postLikeInputSchema = z.object({
	userId: zString('01J8F3RR15SSSVV2F3AGMJ4ZE7'),
	postId: zString('01J8F3RR15SSSVV2F3AGMJ4ZE7'),
})

export type PostLikeInputSchema = z.infer<typeof postLikeInputSchema>

export const createPostLikeRoute = createRoute({
	path: '/postLikes',
	method: 'post',
	description: '投稿にいいねをする',
	operationId: 'createPostLike',
	request: {
		body: {
			required: true,
			content: {
				'application/json': {
					schema: postLikeInputSchema,
				},
			},
		},
	},
	responses: {
		200: {
			description: '投稿にいいね',
			content: {
				'application/json': {
					schema: z.object({
						userId: zString('01J8F3RR15SSSVV2F3AGMJ4ZE7'),
						postId: zString('01J8F3RR15SSSVV2F3AGMJ4ZE7'),
					}),
				},
			},
		},
	},
})

export const deletePostLikeRoute = createRoute({
	path: '/postLikes',
	method: 'put',
	description: '投稿にいいねを解除する',
	operationId: 'deletePostLike',
	request: {
		body: {
			required: true,
			content: {
				'application/json': {
					schema: postLikeInputSchema,
				},
			},
		},
	},
	responses: {
		200: {
			description: '投稿にいいねを解除',
			content: {
				'application/json': {
					schema: z.object({
						userId: zString('01J8F3RR15SSSVV2F3AGMJ4ZE7'),
						postId: zString('01J8F3RR15SSSVV2F3AGMJ4ZE7'),
					}),
				},
			},
		},
	},
})
