import { OpenAPIHono } from '@hono/zod-openapi'

import {
	createPostRoute,
	deletePostRoute,
	fetchMediaItemPostListRoute,
	fetchPostDetailRoute,
	fetchPostLikePostListRoute,
	fetchPostListInRegionRoute,
	fetchPostListRoute,
	fetchUserDraftListRoute,
	fetchUserPostListInRegionRoute,
	fetchUserPostListRoute,
	fetchUserTagPostListRoute,
	searchPostLikePostListRoute,
	searchUserPostListRoute,
	updatePostRoute,
} from '../../openapi/post'
import { handleErrors } from '../error'
import { svc } from '../service'

const app = new OpenAPIHono()

app.openapi(fetchPostListRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const { limit, offset } = ctx.req.valid('query')
		const { res, totalCount } = await svc.post.getAll(ctx)
		const limitNum = Number(limit)
		const offsetNum = Number(offset)
		return ctx.json({
			posts: res,
			limit: limitNum,
			offset: offsetNum,
			totalCount,
		})
	}, c)
})

app.openapi(fetchPostListInRegionRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const { limit, minLat, maxLat, minLng, maxLng } = ctx.req.valid('query')
		const limitNum = Number(limit)
		const minLatNum = Number(minLat)
		const maxLatNum = Number(maxLat)
		const minLngNum = Number(minLng)
		const maxLngNum = Number(maxLng)
		const res = await svc.post.getAllInRegion(
			ctx,
			limitNum,
			minLatNum,
			maxLatNum,
			minLngNum,
			maxLngNum
		)
		return ctx.json({ posts: res })
	}, c)
})

app.openapi(fetchUserPostListRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const { userId } = ctx.req.valid('param')
		const { limit, offset, startDate, endDate } = ctx.req.valid('query')
		const limitNum = Number(limit)
		const offsetNum = Number(offset)
		const { res, totalCount } = await svc.post.getByUserId(ctx, userId, {
			limit: limitNum,
			offset: offsetNum,
			startDate,
			endDate,
		})
		return ctx.json({
			posts: res,
			limit: limitNum,
			offset: offsetNum,
			totalCount,
		})
	}, c)
})

app.openapi(fetchUserDraftListRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const { userId } = ctx.req.valid('param')
		const { limit, offset, startDate, endDate } = ctx.req.valid('query')
		const limitNum = Number(limit)
		const offsetNum = Number(offset)
		const { res, totalCount } = await svc.post.getDraftByUserId(ctx, userId, {
			limit: limitNum,
			offset: offsetNum,
			startDate,
			endDate,
		})
		return ctx.json({
			posts: res,
			limit: limitNum,
			offset: offsetNum,
			totalCount,
		})
	}, c)
})

app.openapi(fetchUserPostListInRegionRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const { userId } = ctx.req.valid('param')
		const { limit, minLat, maxLat, minLng, maxLng } = ctx.req.valid('query')
		const limitNum = Number(limit)
		const minLatNum = Number(minLat)
		const maxLatNum = Number(maxLat)
		const minLngNum = Number(minLng)
		const maxLngNum = Number(maxLng)
		const res = await svc.post.getByUserIdInRegion(
			ctx,
			limitNum,
			userId,
			minLatNum,
			maxLatNum,
			minLngNum,
			maxLngNum
		)
		return ctx.json({
			posts: res,
		})
	}, c)
})

app.openapi(searchUserPostListRoute, async (c) => {
	return handleErrors(async (ctx) => {
		console.log('start', new Date())
		const { userId } = ctx.req.valid('param')
		const { q, startDate, endDate, limit, offset } = ctx.req.valid('query')
		const limitNum = Number(limit)
		const offsetNum = Number(offset)
		const { res, totalCount } = await svc.post.getBySearch(
			ctx,
			userId,
			q,
			startDate,
			endDate,
			limitNum,
			offsetNum
		)
		console.log('enddd', new Date())
		return ctx.json({
			posts: res,
			limit: limitNum,
			offset: offsetNum,
			totalCount,
		})
	}, c)
})

app.openapi(fetchPostDetailRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const { postId } = ctx.req.valid('param')
		const res = await svc.post.getByPostId(ctx, postId)
		return ctx.json({ post: res })
	}, c)
})

app.openapi(fetchMediaItemPostListRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const { mediaItemId } = ctx.req.valid('param')
		const { limit, offset } = ctx.req.valid('query')
		const limitNum = Number(limit)
		const offsetNum = Number(offset)
		const { res, totalCount } = await svc.post.getByMediaItemId(
			ctx,
			limitNum,
			offsetNum,
			mediaItemId
		)
		return ctx.json({
			posts: res,
			limit: limitNum,
			offset: offsetNum,
			totalCount,
		})
	}, c)
})

app.openapi(fetchUserTagPostListRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const { userId, tagId } = ctx.req.valid('param')
		const { limit, offset } = ctx.req.valid('query')
		const limitNum = Number(limit)
		const offsetNum = Number(offset)
		const { res, totalCount } = await svc.post.getByUserTagId(
			ctx,
			userId,
			tagId,
			limitNum,
			offsetNum
		)
		return ctx.json({
			posts: res,
			limit: limitNum,
			offset: offsetNum,
			totalCount,
		})
	}, c)
})

app.openapi(fetchPostLikePostListRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const { userId } = ctx.req.valid('param')
		const { limit, offset } = ctx.req.valid('query')
		const limitNum = Number(limit)
		const offsetNum = Number(offset)
		const { res, totalCount } = await svc.post.getByPostLikeUserId(
			ctx,
			userId,
			limitNum,
			offsetNum
		)
		return ctx.json({
			posts: res,
			limit: limitNum,
			offset: offsetNum,
			totalCount,
		})
	}, c)
})

app.openapi(searchPostLikePostListRoute, async (c) => {
	return handleErrors(async (ctx) => {
		const { userId } = ctx.req.valid('param')
		const { q, startDate, endDate, limit, offset } = ctx.req.valid('query')
		const limitNum = Number(limit)
		const offsetNum = Number(offset)
		const { res, totalCount } = await svc.post.getBySearchPostLike(
			ctx,
			userId,
			q,
			startDate,
			endDate,
			limitNum,
			offsetNum
		)
		return ctx.json({
			posts: res,
			limit: limitNum,
			offset: offsetNum,
			totalCount,
		})
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
