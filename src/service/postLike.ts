import { Context } from 'hono'
import { PostLikeInputSchema } from '../../openapi/postLike'
import { domain } from '../domain'
import { repo } from '../repository'

class PostLikeService {
	async create(c: Context, body: PostLikeInputSchema) {
		await domain.postLike.duplicateCheck(c, body)
		return await repo.postLike.create(c, body)
	}
	async delete(c: Context, body: PostLikeInputSchema) {
		return await repo.postLike.delete(c, body)
	}
}

export const postLikeSvc = new PostLikeService()
