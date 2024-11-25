import { Context } from 'hono'
import { TagInputSchema } from '../../openapi/tag'
import { repo } from '../repository'

class TagService {
	async getByUserId(c: Context, userId: string, limit: number, offset: number) {
		return await repo.tag.getByUserId(c, userId, limit, offset)
	}
	async getById(c: Context, tagId: string) {
		return await repo.tag.getById(c, tagId)
	}
	async create(c: Context, body: TagInputSchema) {
		return await repo.tag.create(c, body)
	}
	async updateByTagId(c: Context, tagId: string, body: TagInputSchema) {
		return await repo.tag.updateByTagId(c, tagId, body)
	}
	async deleteByTagId(c: Context, tagId: string) {
		return await repo.tag.deleteByTagId(c, tagId)
	}
}

export const tagSvc = new TagService()
