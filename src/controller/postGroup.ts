import { OpenAPIHono } from '@hono/zod-openapi'
import {
	createPostGroupRoute,
	deletePostGroupRoute,
	fetchGroupPostIdListRoute,
} from '../../openapi/postGroup'
import { handleErrors } from '../error'
import { svc } from '../service'

const app = new OpenAPIHono()

app.openapi(fetchGroupPostIdListRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const { groupId } = ctx.req.valid('param')
		const res = await svc.postGroup.getByGroupId(ctx, groupId)
		return ctx.json({ postIds: res })
	}, c)
})

app.openapi(createPostGroupRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const body = ctx.req.valid('json')
		const res = await svc.postGroup.create(ctx, body)
		return ctx.json({ ...res })
	}, c)
})

app.openapi(deletePostGroupRoute, async (c) => {
	console.log('deletePostGroupRoute')
	return handleErrors(async (ctx) => {
		const body = ctx.req.valid('json')
		console.log('cont', body)
		const res = await svc.postGroup.delete(ctx, body)
		return ctx.json({ ...res })
	}, c)
})

export { app as postGroupApp }
