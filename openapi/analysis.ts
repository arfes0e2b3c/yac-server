import { createRoute, z } from '@hono/zod-openapi'
import { zNum, zString } from './common'
import { postWithMediaItemAndTagSchema } from './post'

const userQuantitativeAnalysisSchema = z.object({
	total: z.object({
		dateCount: zNum(10),
		postCount: zNum(10),
		contentLengthSum: zNum(10),
		maxDateCombo: zNum(10),
		positivePostRatio: zNum(50),
		averageEmotionScore: zNum(10),
		favoriteCount: zNum(10),
		mostUsedTag: zString('タグ'),
		mostUsedMediaItem: zString('メディアアイテム'),
		mostFrequentTime: zString('10:00'),
		maxPositiveEmotionPost: postWithMediaItemAndTagSchema,
		maxNegativeEmotionPost: postWithMediaItemAndTagSchema,
		maxLengthTextPost: postWithMediaItemAndTagSchema,
		minLengthTextPost: postWithMediaItemAndTagSchema,
	}),
	month: z.object({
		postCount: zNum(10),
		contentLengthSum: zNum(10),
		currentCombo: zNum(10),
		positivePostRatio: zNum(50),
		averageEmotionScore: zNum(10),
		favoriteCount: zNum(10),
		mostUsedTag: zString('タグ'),
		mostUsedMediaItem: zString('メディアアイテム'),
		maxPositiveEmotionPost: postWithMediaItemAndTagSchema,
		maxNegativeEmotionPost: postWithMediaItemAndTagSchema,
		maxLengthTextPost: postWithMediaItemAndTagSchema,
		minLengthTextPost: postWithMediaItemAndTagSchema,
	}),
})

export const fetchUserQuantitativeAnalysisRoute = createRoute({
	path: '/users/{userId}/analysis/quantiative',
	method: 'get',
	operationId: 'fetchUserQuantitativeAnalysis',
	description: 'ユーザーの定量分析を取得する',
	request: {
		params: z.object({
			userId: zString('01J8F3CJR0NJM89W64KYWSEJVA'),
		}),
	},
	responses: {
		200: {
			description: 'ユーザー統計情報',
			content: {
				'application/json': {
					schema: userQuantitativeAnalysisSchema,
				},
			},
		},
	},
})

export const fetchUserQualitativeAnalysisRoute = createRoute({
	path: '/users/{userId}/analysis/qualitative',
	method: 'get',
	operationId: 'fetchUserQualitativeAnalysis',
	description: 'ユーザーの定性分析を取得する',
	request: {
		params: z.object({
			userId: zString('01J8F3CJR0NJM89W64KYWSEJVA'),
		}),
	},
	responses: {
		200: {
			description: 'ユーザー感情分析',
			content: {
				'application/json': {
					schema: zString('感情分析結果'),
				},
			},
		},
	},
})
