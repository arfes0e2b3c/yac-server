import { Context } from 'hono'
import {
	InfiniteBaseQueryWithDateSchema,
	UpsertPostInputSchema,
} from '../../openapi/post'
import { api } from '../api'
import { repo } from '../repository'

class PostService {
	async getAll(c: Context) {
		return await repo.post.getAll(c)
	}
	async getAllInRegion(
		c: Context,
		limit: number,
		minLat: number,
		maxLat: number,
		minLng: number,
		maxLng: number
	) {
		return await repo.post.getAllInRegion(
			c,
			limit,
			minLat,
			maxLat,
			minLng,
			maxLng
		)
	}
	async getByPostId(c: Context, postId: string) {
		return await repo.post.getByPostId(c, postId)
	}
	async getByUserId(
		c: Context,
		userId: string,
		query: InfiniteBaseQueryWithDateSchema
	) {
		return await repo.post.getByUserId(c, userId, query)
	}
	async getByUserIdInRegion(
		c: Context,
		limit: number,
		userId: string,
		minLat: number,
		maxLat: number,
		minLng: number,
		maxLng: number
	) {
		return await repo.post.getByUserIdInRegion(
			c,
			limit,
			userId,
			minLat,
			maxLat,
			minLng,
			maxLng
		)
	}
	async getBySearch(
		c: Context,
		userId: string,
		q: string,
		startDate: string,
		endDate: string,
		limit: number,
		offset: number
	) {
		return await repo.post.getBySearch(
			c,
			userId,
			q,
			startDate,
			endDate,
			limit,
			offset
		)
	}
	async getByMediaItemId(
		c: Context,
		limit: number,
		offset: number,
		mediaItemId: string
	) {
		return await repo.post.getByMediaItemId(c, limit, offset, mediaItemId)
	}
	async getByUserTagId(
		c: Context,
		userId: string,
		tagId: string,
		limit: number,
		offset: number
	) {
		return await repo.post.getByUserTagId(c, userId, tagId, limit, offset)
	}

	async getByPostLikeUserId(
		c: Context,
		userId: string,
		limit: number,
		offset: number
	) {
		return await repo.post.getByPostLikeUserId(c, userId, limit, offset)
	}

	async getBySearchPostLike(
		c: Context,
		userId: string,
		q: string,
		startDate: string,
		endDate: string,
		limit: number,
		offset: number
	) {
		return await repo.post.getBySearchPostLikeUserId(
			c,
			userId,
			q,
			startDate,
			endDate,
			limit,
			offset
		)
	}

	async create(c: Context, body: UpsertPostInputSchema) {
		const score = await api.openAi.evaluateSentiment(c, body.post.content)
		const postRes = await repo.post.create(c, body.post, score)
		for (const tagId of body.tagIds ?? []) {
			await repo.postTag.create(c, { postId: postRes.id, tagId })
		}
		return postRes
	}
	async updateByPostId(
		c: Context,
		postId: string,
		body: UpsertPostInputSchema
	) {
		const score = await api.openAi.evaluateSentiment(c, body.post.content)
		const postRes = await repo.post.updateByPostId(c, postId, body.post, score)
		const tags = await repo.postTag.getByPostId(c, postId)
		const unRegisteredtagIds =
			body.tagIds?.filter(
				(tagId) => tags.find((tag) => tag.tagId === tagId) === undefined
			) ?? []
		for (const tagId of unRegisteredtagIds ?? []) {
			await repo.postTag.create(c, { postId: postRes.id, tagId })
		}
		return postRes
	}
	async deleteByPostId(c: Context, postId: string) {
		return await repo.post.deleteByPostId(c, postId)
	}
}

export const postSvc = new PostService()
