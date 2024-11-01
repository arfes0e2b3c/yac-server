import { swaggerUI } from '@hono/swagger-ui'
import { OpenAPIHono } from '@hono/zod-openapi'
import { HTTPException } from 'hono/http-exception'
import { mediaItemApp } from './controller/mediaItem'
import { postApp } from './controller/post'
import { tagApp } from './controller/tag'
import { userApp } from './controller/user'

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
app.get('/', (c) => c.text('Hello, World!'))

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

export default app
