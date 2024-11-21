import { Context } from 'hono'
import { GroupInputSchema } from '../../openapi/group'
import { repo } from '../repository'

class GroupService {
	async getByUserId(c: Context, userId: string, limit: number, offset: number) {
		return await repo.group.getByUserId(c, userId, limit, offset)
	}
	async getById(c: Context, groupId: string) {
		return await repo.group.getById(c, groupId)
	}
	async create(c: Context, body: GroupInputSchema) {
		return await repo.group.create(c, body)
	}
	async updateByGroupId(c: Context, groupId: string, body: GroupInputSchema) {
		return await repo.group.updateByGroupId(c, groupId, body)
	}
	async deleteByGroupId(c: Context, groupId: string) {
		return await repo.group.deleteByGroupId(c, groupId)
	}
}

export const groupSvc = new GroupService()
