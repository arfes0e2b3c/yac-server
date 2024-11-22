import { Context } from 'hono'
import {
	PostGroupDeleteInputSchema,
	PostGroupInputSchema,
} from '../../openapi/postGroup'
import { repo } from '../repository'

class PostGroupService {
	async getByGroupId(c: Context, groupId: string) {
		const res = await repo.postGroup.getByGroupId(c, groupId)
		return res.map((r) => r.postId)
	}
	async create(c: Context, body: PostGroupInputSchema) {
		return await repo.postGroup.create(c, body)
	}
	async delete(c: Context, body: PostGroupDeleteInputSchema) {
		return await repo.postGroup.delete(c, body)
	}
}

export const postGroupSvc = new PostGroupService()
