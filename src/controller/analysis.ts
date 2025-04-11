import { OpenAPIHono } from '@hono/zod-openapi'
import {
	fetchUserQualitativeAnalysisRoute,
	fetchUserQuantitativeAnalysisRoute,
} from '../../openapi/analysis'
import { handleErrors } from '../error'
import { svc } from '../service'

const app = new OpenAPIHono()

app.openapi(fetchUserQuantitativeAnalysisRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const { userId } = ctx.req.valid('param')
		const res = await svc.analysis.getUserQuantitative(ctx, userId)
		return ctx.json(res)
	}, c)
})

app.openapi(fetchUserQualitativeAnalysisRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const { userId } = ctx.req.valid('param')
		const res = await svc.analysis.getUserQualitative(ctx, userId)
		return ctx.json(res)
	}, c)
})

export { app as analysisApp }
