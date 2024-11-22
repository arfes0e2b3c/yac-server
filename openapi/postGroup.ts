import { createRoute, z } from '@hono/zod-openapi'
import { zDate, zString } from './common'

export const postGroupSchema = z.object({
	id: zString('01J8F3RR15SSSVV2F3AGMJ4ZE7'),
	postId: zString('01J8F3RR15SSSVV2F3AGMJ4ZE7'),
	groupId: zString('01J8F3RR15SSSVV2F3AGMJ4ZE7'),
	createdAt: zDate('2024-09-23 07:57:06'),
	updatedAt: zDate('2024-09-23 07:57:06'),
	deletedAt: zDate('2024-09-23 07:57:06').nullable(),
})

export const postGroupInputSchema = z.object({
	postId: zString('01J8F3RR15SSSVV2F3AGMJ4ZE7'),
	groupId: zString('01J8F3RR15SSSVV2F3AGMJ4ZE7'),
})

export const postGroupDeleteInputSchema = z.object({
	postIds: z.array(zString('01J8F3RR15SSSVV2F3AGMJ4ZE7')),
	groupId: zString('01J8F3RR15SSSVV2F3AGMJ4ZE7'),
})

export type PostGroupSchema = z.infer<typeof postGroupSchema>
export type PostGroupInputSchema = z.infer<typeof postGroupInputSchema>
export type PostGroupDeleteInputSchema = z.infer<
	typeof postGroupDeleteInputSchema
>

export const postGroupListSchema = z.object({
	postGroups: z.array(postGroupSchema),
})

export const postIdListSchema = z.object({
	postIds: z.array(zString('01J8F3RR15SSSVV2F3AGMJ4ZE7')),
})

export const fetchGroupPostIdListRoute = createRoute({
	path: '/postGroups/{groupId}',
	method: 'get',
	description: 'グループに紐付いた投稿のID一覧を取得する',
	operationId: 'fetchGroupPostIdList',
	request: {
		params: z.object({
			groupId: zString('01J8F3RR15SSSVV2F3AGMJ4ZE7'),
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

export const createPostGroupRoute = createRoute({
	path: '/postGroups',
	method: 'post',
	description: '投稿とグループを紐付ける',
	operationId: 'createPostGroup',
	request: {
		body: {
			required: true,
			content: {
				'application/json': {
					schema: postGroupInputSchema,
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
						groupId: zString('01J8F3RR15SSSVV2F3AGMJ4ZE7'),
					}),
				},
			},
		},
	},
})

export const deletePostGroupRoute = createRoute({
	path: '/postGroups',
	method: 'put',
	description: '投稿とグループの紐付けを解除する',
	operationId: 'deletePostGroup',
	request: {
		body: {
			required: true,
			content: {
				'application/json': {
					schema: postGroupDeleteInputSchema,
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
						groupId: zString('01J8F3RR15SSSVV2F3AGMJ4ZE7'),
					}),
				},
			},
		},
	},
})
