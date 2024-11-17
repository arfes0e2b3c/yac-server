import { Context } from 'hono'
import { MediaItemInputSchema } from '../../openapi/mediaItem'
import { repo } from '../repository'

class MediaItemService {
	async getAll(c: Context, limit: number, offset: number) {
		return await repo.mediaItem.getAll(c, limit, offset)
	}
	async getById(c: Context, mediaItemId: string) {
		return await repo.mediaItem.getById(c, mediaItemId)
	}
	// async getBySearch(c: Context, q: string) {
	// 	return await repo.mediaItem.getBySearch(c, q)
	// }
	async getBySearch(c: Context, q: string, limit: number, offset: number) {
		return await repo.mediaItem.getBySearch(c, q, limit, offset)
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
	async countMediaItemRelations(c: Context) {
		return await repo.mediaItem.countMediaItemRelations(c)
	}
}

export const mediaItemSvc = new MediaItemService()
