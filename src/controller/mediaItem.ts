import { OpenAPIHono } from '@hono/zod-openapi'
import {
	createMediaItemRoute,
	deleteMediaItemRoute,
	fetchMediaItemDetailRoute,
	fetchMediaItemListRoute,
	searchMediaItemListRoute,
	updateMediaItemRoute,
} from '../../openapi/mediaItem'
import { handleErrors } from '../error'
import { svc } from '../service'

const app = new OpenAPIHono()

app.openapi(fetchMediaItemListRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const { limit, offset } = ctx.req.valid('query')
		const limitNum = Number(limit)
		const offsetNum = Number(offset)
		const { res, totalCount } = await svc.mediaItem.getAll(
			ctx,
			limitNum,
			offsetNum
		)
		return ctx.json({
			mediaItems: res,
			limit: limitNum,
			offset: offsetNum,
			totalCount,
		})
	}, c)
})

app.openapi(searchMediaItemListRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const { q, limit, offset } = ctx.req.valid('query')
		const limitNum = Number(limit)
		const offsetNum = Number(offset)
		const { res, totalCount } = await svc.mediaItem.getBySearch(
			ctx,
			q,
			limitNum,
			offsetNum
		)
		return ctx.json({
			mediaItems: res,
			limit: limitNum,
			offset: offsetNum,
			totalCount,
		})
	}, c)
})

app.openapi(fetchMediaItemDetailRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const { mediaItemId } = ctx.req.valid('param')
		const res = await svc.mediaItem.getById(ctx, mediaItemId)
		return ctx.json({ mediaItem: res })
	}, c)
})

app.openapi(createMediaItemRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const body = ctx.req.valid('json')
		const res = await svc.mediaItem.create(ctx, body)
		return ctx.json(res)
	}, c)
})

app.openapi(updateMediaItemRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const { mediaItemId } = ctx.req.valid('param')
		const body = ctx.req.valid('json')
		const res = await svc.mediaItem.updateByMediaItemId(ctx, mediaItemId, body)
		return ctx.json(res)
	}, c)
})

app.openapi(deleteMediaItemRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const { mediaItemId } = ctx.req.valid('param')
		const res = await svc.mediaItem.deleteByMediaItemId(ctx, mediaItemId)
		return ctx.json(res)
	}, c)
})

export { app as mediaItemApp }
