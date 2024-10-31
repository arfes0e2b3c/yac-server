import { OpenAPIHono } from '@hono/zod-openapi'

import {
	createPostRoute,
	deletePostRoute,
	fetchPostDetailRoute,
	fetchPostListRoute,
	updatePostRoute,
} from '../../openapi/post'
import { handleErrors } from '../error'
import { svc } from '../service'

const app = new OpenAPIHono()

app.openapi(fetchPostListRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const res = await svc.post.getAll(ctx)
		console.log(res)
		return ctx.json({ posts: res })
	}, c)
})

app.openapi(fetchPostDetailRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const { postId } = ctx.req.valid('param')
		const res = await svc.post.getByPostId(ctx, postId)
		return ctx.json({ post: res })
	}, c)
})

app.openapi(createPostRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const body = ctx.req.valid('json')
		const res = await svc.post.create(ctx, body)
		return ctx.json(res)
	}, c)
})

app.openapi(updatePostRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const { postId } = ctx.req.valid('param')
		const body = ctx.req.valid('json')
		const res = await svc.post.updateByPostId(ctx, postId, body)
		return ctx.json(res)
	}, c)
})

app.openapi(deletePostRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const { postId } = ctx.req.valid('param')
		const res = await svc.post.deleteByPostId(ctx, postId)
		return ctx.json(res)
	}, c)
})

export { app as postApp }
