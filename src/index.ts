import { swaggerUI } from '@hono/swagger-ui'
import { OpenAPIHono } from '@hono/zod-openapi'
import { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { apiApp } from './controller/api'
import { mediaItemApp } from './controller/mediaItem'
import { postApp } from './controller/post'
import { postLikeApp } from './controller/postLike'
import { postTagApp } from './controller/postTag'
import { tagApp } from './controller/tag'
import { userApp } from './controller/user'
import { svc } from './service'
import { ReneEnv } from './types'

const app = new OpenAPIHono().basePath('/api')

app.onError((err, c) => {
	if (err instanceof HTTPException) {
		console.error('App Error:', err)
		return err.getResponse()
	}
	console.error('Unhandled Error:', err)
	return c.text(`Unexpected Error: ${err.message}`, 500)
})

app.route('/', userApp)
app.route('/', postApp)
app.route('/', tagApp)
app.route('/', mediaItemApp)
app.route('/', postTagApp)
app.route('/', apiApp)
app.route('/', postLikeApp)

app.doc31('/doc', {
	openapi: '3.1.0',
	info: {
		title: 'api',
		version: '1.0.0',
	},
})

app.get(
	'/ui',
	swaggerUI({
		url: '/api/doc',
	})
)

// scheduledが個別のappからは呼び出せないので仕方なくここに書いている
const scheduled: ExportedHandlerScheduledHandler<ReneEnv> = async (
	_,
	env,
	c
) => {
	const ctx = {
		env,
	} as Context
	c.waitUntil(svc.mediaItem.countMediaItemRelations(ctx))
}

export default {
	fetch: app.fetch,
	scheduled,
}
