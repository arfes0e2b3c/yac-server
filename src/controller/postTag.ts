import { OpenAPIHono } from '@hono/zod-openapi'

import {
	createPostTagRoute,
	deletePostTagRoute,
	fetchTagPostIdListRoute,
} from '../../openapi/postTag'
import { handleErrors } from '../error'
import { svc } from '../service'

const app = new OpenAPIHono()

app.openapi(fetchTagPostIdListRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const { tagId } = ctx.req.valid('param')
		const res = await svc.postTag.getByTagId(ctx, tagId)
		return ctx.json({ postIds: res })
	}, c)
})

app.openapi(createPostTagRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const body = ctx.req.valid('json')
		const res = await svc.postTag.create(ctx, body)
		return ctx.json({ ...res })
	}, c)
})

app.openapi(deletePostTagRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const body = ctx.req.valid('json')
		const res = await svc.postTag.delete(ctx, body)
		return ctx.json({ ...res })
	}, c)
})

export { app as postTagApp }
