import { Context } from 'hono'
import { UserInputSchema } from '../../openapi/user'
import { repo } from '../repository'

class UserService {
	async getAll(c: Context) {
		return await repo.user.getAll(c)
	}
	async getById(c: Context, userId: string) {
		return await repo.user.getById(c, userId)
	}
	async create(c: Context, body: UserInputSchema) {
		return await repo.user.create(c, body)
	}
	async updateByUserId(c: Context, userId: string, body: UserInputSchema) {
		return await repo.user.updateByUserId(c, userId, body)
	}
	async deleteByUserId(c: Context, userId: string) {
		return await repo.user.deleteByUserId(c, userId)
	}
}

export const userSvc = new UserService()
