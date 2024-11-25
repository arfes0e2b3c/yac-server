import { Context } from 'hono'
import {
	PostTagDeleteInputSchema,
	PostTagInputSchema,
} from '../../openapi/postTag'
import { repo } from '../repository'

class PostTagService {
	async getByTagId(c: Context, tagId: string) {
		const res = await repo.postTag.getByTagId(c, tagId)
		return res.map((r) => r.postId)
	}
	async create(c: Context, body: PostTagInputSchema) {
		return await repo.postTag.create(c, body)
	}
	async delete(c: Context, body: PostTagDeleteInputSchema) {
		return await repo.postTag.delete(c, body)
	}
}

export const postTagSvc = new PostTagService()
