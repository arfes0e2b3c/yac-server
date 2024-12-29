import { OpenAPIHono } from '@hono/zod-openapi'
import {
	createPostLikeRoute,
	deletePostLikeRoute,
} from '../../openapi/postLike'
import { handleErrors } from '../error'
import { svc } from '../service'

const app = new OpenAPIHono()

app.openapi(createPostLikeRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const body = ctx.req.valid('json')
		const res = await svc.postLike.create(ctx, body)
		return ctx.json({ ...res })
	}, c)
})

app.openapi(deletePostLikeRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const body = ctx.req.valid('json')
		const res = await svc.postLike.delete(ctx, body)
		return ctx.json({ ...res })
	}, c)
})

export { app as postLikeApp }
