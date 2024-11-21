import { OpenAPIHono } from '@hono/zod-openapi'
import {
	createGroupRoute,
	deleteGroupRoute,
	fetchGroupDetailRoute,
	fetchUserGroupListRoute,
	updateGroupRoute,
} from '../../openapi/group'
import { handleErrors } from '../error'
import { svc } from '../service'

const app = new OpenAPIHono()

app.openapi(fetchUserGroupListRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const { userId } = ctx.req.valid('param')
		const { limit, offset } = ctx.req.valid('query')
		const limitNum = Number(limit)
		const offsetNum = Number(offset)
		const res = await svc.group.getByUserId(ctx, userId, limitNum, offsetNum)
		return ctx.json({ groups: res })
	}, c)
})

app.openapi(fetchGroupDetailRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const { groupId } = ctx.req.valid('param')
		const res = await svc.group.getById(ctx, groupId)
		return ctx.json({ group: res })
	}, c)
})

app.openapi(createGroupRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const body = ctx.req.valid('json')
		const res = await svc.group.create(ctx, body)
		return ctx.json(res)
	}, c)
})

app.openapi(updateGroupRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const { groupId } = ctx.req.valid('param')
		const body = ctx.req.valid('json')
		const res = await svc.group.updateByGroupId(ctx, groupId, body)
		return ctx.json(res)
	}, c)
})

app.openapi(deleteGroupRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const { groupId } = ctx.req.valid('param')
		const res = await svc.group.deleteByGroupId(ctx, groupId)
		return ctx.json(res)
	}, c)
})

export { app as groupApp }
