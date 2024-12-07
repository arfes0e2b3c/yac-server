import { OpenAPIHono } from '@hono/zod-openapi'
import {
	createTagRoute,
	deleteTagRoute,
	fetchTagDetailRoute,
	fetchUserTagListRoute,
	searchTagListRoute,
	updateTagRoute,
} from '../../openapi/tag'
import { handleErrors } from '../error'
import { svc } from '../service'

const app = new OpenAPIHono()

app.openapi(fetchUserTagListRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const { userId } = ctx.req.valid('param')
		const { limit, offset } = ctx.req.valid('query')
		const limitNum = Number(limit)
		const offsetNum = Number(offset)
		const { res, totalCount } = await svc.tag.getByUserId(
			ctx,
			userId,
			limitNum,
			offsetNum
		)
		return ctx.json({
			tags: res,
			limit: limitNum,
			offset: offsetNum,
			totalCount,
		})
	}, c)
})

app.openapi(fetchTagDetailRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const { tagId } = ctx.req.valid('param')
		const res = await svc.tag.getById(ctx, tagId)
		return ctx.json({ tag: res })
	}, c)
})

app.openapi(searchTagListRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const { userId } = ctx.req.valid('param')
		const { q, limit, offset } = ctx.req.valid('query')
		const limitNum = Number(limit)
		const offsetNum = Number(offset)
		const { res, totalCount } = await svc.tag.getBySearch(
			ctx,
			userId,
			q,
			limitNum,
			offsetNum
		)
		return ctx.json({
			tags: res,
			limit: limitNum,
			offset: offsetNum,
			totalCount,
		})
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
		const { tagIds } = ctx.req.valid('json')
		const res = await svc.tag.deleteByTagIds(ctx, tagIds)
		return ctx.json(res.map((tag) => tag.id))
	}, c)
})

export { app as tagApp }
