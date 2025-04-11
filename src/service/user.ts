import { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { UserInputSchema } from '../../openapi/user'
import { api } from '../api'
import { repo } from '../repository'

class UserService {
	async getAll(c: Context) {
		return await repo.user.getAll(c)
	}
	async getById(c: Context, userId: string) {
		const res = await repo.user.getById(c, userId)
		if (!res) {
			throw new HTTPException(500, { message: 'User not found' })
		}
		return res
	}
	async create(c: Context, body: UserInputSchema) {
		return await repo.user.create(c, body)
	}
	async updateByUserId(c: Context, userId: string, body: UserInputSchema) {
		return await repo.user.updateByUserId(c, userId, body)
	}
	async deleteByUserId(c: Context, userId: string) {
		const supabaseRes = await api.supabase.deleteUser(c, userId)
		console.log('supabaseRes', supabaseRes)
		return await repo.user.deleteByUserId(c, userId)
	}
}

export const userSvc = new UserService()
