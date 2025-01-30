import { OpenAPIHono } from '@hono/zod-openapi'
import { updateUserSettingRoute } from '../../openapi/userSetting'
import { handleErrors } from '../error'
import { svc } from '../service'

const app = new OpenAPIHono()

app.openapi(updateUserSettingRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const { userId } = ctx.req.valid('param')
		const body = ctx.req.valid('json')
		const res = await svc.userSetting.update(ctx, userId, body)
		return ctx.json(res)
	}, c)
})

export { app as userSettingApp }
