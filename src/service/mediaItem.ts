import { Context } from 'hono'
import { MediaItemInputSchema } from '../../openapi/mediaItem'
import { repo } from '../repository'

class MediaItemService {
	async getAll(c: Context) {
		return await repo.mediaItem.getAll(c)
	}
	async getById(c: Context, mediaItemId: string) {
		return await repo.mediaItem.getById(c, mediaItemId)
	}
	async create(c: Context, body: MediaItemInputSchema) {
		return await repo.mediaItem.create(c, body)
	}
	async updateByMediaItemId(
		c: Context,
		mediaItemId: string,
		body: MediaItemInputSchema
	) {
		return await repo.mediaItem.updateByMediaItemId(c, mediaItemId, body)
	}
	async deleteByMediaItemId(c: Context, mediaItemId: string) {
		return await repo.mediaItem.deleteByMediaItemId(c, mediaItemId)
	}
}

export const mediaItemSvc = new MediaItemService()
