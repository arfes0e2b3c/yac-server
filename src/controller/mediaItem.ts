import { OpenAPIHono } from '@hono/zod-openapi'
import {
	createMediaItemRoute,
	deleteMediaItemRoute,
	fetchMediaItemDetailRoute,
	fetchMediaItemListRoute,
	updateMediaItemRoute,
} from '../../openapi/mediaItem'
import { handleErrors } from '../error'
import { svc } from '../service'

const app = new OpenAPIHono()

app.openapi(fetchMediaItemListRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const res = await svc.mediaItem.getAll(ctx)
		return ctx.json({ mediaItems: res })
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
