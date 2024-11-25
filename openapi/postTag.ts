import { createRoute, z } from '@hono/zod-openapi'
import { zDate, zString } from './common'

export const postTagSchema = z.object({
	id: zString('01J8F3RR15SSSVV2F3AGMJ4ZE7'),
	postId: zString('01J8F3RR15SSSVV2F3AGMJ4ZE7'),
	tagId: zString('01J8F3RR15SSSVV2F3AGMJ4ZE7'),
	createdAt: zDate('2024-09-23 07:57:06'),
	updatedAt: zDate('2024-09-23 07:57:06'),
	deletedAt: zDate('2024-09-23 07:57:06').nullable(),
})

export const postTagInputSchema = z.object({
	postId: zString('01J8F3RR15SSSVV2F3AGMJ4ZE7'),
	tagId: zString('01J8F3RR15SSSVV2F3AGMJ4ZE7'),
})

export const postTagDeleteInputSchema = z.object({
	postIds: z.array(zString('01J8F3RR15SSSVV2F3AGMJ4ZE7')),
	tagId: zString('01J8F3RR15SSSVV2F3AGMJ4ZE7'),
})

export type PostTagSchema = z.infer<typeof postTagSchema>
export type PostTagInputSchema = z.infer<typeof postTagInputSchema>
export type PostTagDeleteInputSchema = z.infer<typeof postTagDeleteInputSchema>

export const postTagListSchema = z.object({
	postTags: z.array(postTagSchema),
})

export const postIdListSchema = z.object({
	postIds: z.array(zString('01J8F3RR15SSSVV2F3AGMJ4ZE7')),
})

export const fetchTagPostIdListRoute = createRoute({
	path: '/postTags/{tagId}',
	method: 'get',
	description: 'グループに紐付いた投稿のID一覧を取得する',
	operationId: 'fetchTagPostIdList',
	request: {
		params: z.object({
			tagId: zString('01J8F3RR15SSSVV2F3AGMJ4ZE7'),
		}),
	},
	responses: {
		200: {
			description: '投稿とグループの紐付け一覧',
			content: {
				'application/json': {
					schema: postIdListSchema,
				},
			},
		},
	},
})

export const createPostTagRoute = createRoute({
	path: '/postTags',
	method: 'post',
	description: '投稿とグループを紐付ける',
	operationId: 'createPostTag',
	request: {
		body: {
			required: true,
			content: {
				'application/json': {
					schema: postTagInputSchema,
				},
			},
		},
	},
	responses: {
		200: {
			description: '投稿とグループの紐付け',
			content: {
				'application/json': {
					schema: z.object({
						postId: zString('01J8F3RR15SSSVV2F3AGMJ4ZE7'),
						tagId: zString('01J8F3RR15SSSVV2F3AGMJ4ZE7'),
					}),
				},
			},
		},
	},
})

export const deletePostTagRoute = createRoute({
	path: '/postTags',
	method: 'put',
	description: '投稿とグループの紐付けを解除する',
	operationId: 'deletePostTag',
	request: {
		body: {
			required: true,
			content: {
				'application/json': {
					schema: postTagDeleteInputSchema,
				},
			},
		},
	},
	responses: {
		200: {
			description: '投稿とグループの紐付けを解除',
			content: {
				'application/json': {
					schema: z.object({
						postId: zString('01J8F3RR15SSSVV2F3AGMJ4ZE7'),
						tagId: zString('01J8F3RR15SSSVV2F3AGMJ4ZE7'),
					}),
				},
			},
		},
	},
})
