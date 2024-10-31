import { Context } from 'hono'
import { PostInputSchema } from '../../openapi/post'
import { repo } from '../repository'

class PostService {
	async getAll(c: Context) {
		return await repo.post.getAll(c)
	}
	async getByPostId(c: Context, postId: string) {
		return await repo.post.getByPostId(c, postId)
	}
	async getByUserId(c: Context, userId: string) {
		return await repo.post.getByUserId(c, userId)
	}
	async create(c: Context, body: PostInputSchema) {
		return await repo.post.create(c, body)
	}
	async updateByPostId(c: Context, postId: string, body: PostInputSchema) {
		return await repo.post.updateByPostId(c, postId, body)
	}
	async deleteByPostId(c: Context, postId: string) {
		return await repo.post.deleteByPostId(c, postId)
	}
}

export const postSvc = new PostService()
