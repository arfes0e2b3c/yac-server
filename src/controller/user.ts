import { OpenAPIHono } from '@hono/zod-openapi'
import {
	createUserRoute,
	deleteUserRoute,
	fetchMeRoute,
	fetchUserDetailRoute,
	fetchUserListRoute,
	updateUserRoute,
} from '../../openapi/user'
import { handleErrors } from '../error'
import { svc } from '../service'

const app = new OpenAPIHono()

app.openapi(fetchUserListRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const res = await svc.user.getAll(ctx)
		return ctx.json({ users: res })
	}, c)
})

app.openapi(fetchUserDetailRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const { userId } = ctx.req.valid('param')
		const res = await svc.user.getById(ctx, userId)
		return ctx.json({ user: res })
	}, c)
})

// TODO: クライアントから渡ってくる認証情報がよく分からんから後で修正する
app.openapi(fetchMeRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const { userId } = ctx.req.valid('param')
		const res = await svc.user.getById(ctx, userId)
		return ctx.json({ user: res })
	}, c)
})

app.openapi(createUserRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const body = ctx.req.valid('json')
		const res = await svc.user.create(ctx, body)
		return ctx.json(res)
	}, c)
})

app.openapi(updateUserRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const { userId } = ctx.req.valid('param')
		const body = ctx.req.valid('json')
		const res = await svc.user.updateByUserId(ctx, userId, body)
		return ctx.json(res)
	}, c)
})

app.openapi(deleteUserRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const { userId } = ctx.req.valid('param')
		const res = await svc.user.deleteByUserId(ctx, userId)
		return ctx.json(res)
	}, c)
})

export { app as userApp }
