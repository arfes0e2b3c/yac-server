import { OpenAPIHono } from '@hono/zod-openapi'
import {
	createTagRoute,
	deleteTagRoute,
	fetchTagDetailRoute,
	fetchTagListRoute,
	updateTagRoute,
} from '../../openapi/tag'
import { handleErrors } from '../error'
import { svc } from '../service'

const app = new OpenAPIHono()

app.openapi(fetchTagListRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const res = await svc.tag.getAll(ctx)
		return ctx.json({ tags: res })
	}, c)
})

app.openapi(fetchTagDetailRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const { tagId } = ctx.req.valid('param')
		const res = await svc.tag.getById(ctx, tagId)
		return ctx.json({ tag: res })
	}, c)
})

app.openapi(createTagRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const body = ctx.req.valid('json')
		const res = await svc.tag.create(ctx, body)
		return ctx.json(res)
	}, c)
})

app.openapi(updateTagRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const { tagId } = ctx.req.valid('param')
		const body = ctx.req.valid('json')
		const res = await svc.tag.updateByTagId(ctx, tagId, body)
		return ctx.json(res)
	}, c)
})

app.openapi(deleteTagRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const { tagId } = ctx.req.valid('param')
		const res = await svc.tag.deleteByTagId(ctx, tagId)
		return ctx.json(res)
	}, c)
})

export { app as tagApp }
