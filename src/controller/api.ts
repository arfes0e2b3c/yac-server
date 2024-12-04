import { OpenAPIHono } from '@hono/zod-openapi'
import {
	evaluateSentimentRoute,
	generatePresignedUrlRoute,
} from '../../openapi/api'
import { handleErrors } from '../error'
import { svc } from '../service'

const app = new OpenAPIHono()

app.openapi(evaluateSentimentRoute, (c) => {
	return handleErrors(async (ctx) => {
		const { text } = ctx.req.valid('query')
		const res = await svc.api.evaluateSentiment(ctx, text)
		return ctx.json(res)
	}, c)
})

app.openapi(generatePresignedUrlRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const res = await svc.api.generatePresignedUrl(ctx)
		return ctx.json(res)
	}, c)
})

export { app as apiApp }
