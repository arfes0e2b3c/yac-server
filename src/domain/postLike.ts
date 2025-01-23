import { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { PostLikeInputSchema } from '../../openapi/postLike'
import { repo } from '../repository'

class PostLikeDomain {
	async duplicateCheck(c: Context, body: PostLikeInputSchema) {
		const res = await repo.postLike.exist(c, body)
		if (res) {
			throw new HTTPException(400, {
				message: 'Already liked',
			})
		}
	}
}

export const postLikeDomain = new PostLikeDomain()
