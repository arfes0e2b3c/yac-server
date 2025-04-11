import dayjs from 'dayjs'
import { Context } from 'hono'
import { api } from '../api'
import { domain } from '../domain'
import { repo } from '../repository'

class AnalysisService {
	async getUserQuantitative(c: Context, userId: string) {
		const user = await repo.user.getById(c, userId)
		const totalPosts = await repo.post.getAllByUserId(c, userId)
		const sortByScoreTotalPosts = totalPosts.toSorted(
			(a, b) => b.score - a.score
		)
		const sortByLengthTotalPosts = totalPosts.toSorted(
			(a, b) => b.content.length - a.content.length
		)
		const postLikes = await repo.postLike.getAllByUserId(c, userId)

		const monthPosts = totalPosts.filter((post) =>
			dayjs(post.date).isSame(dayjs(), 'month')
		)
		const sortByScoreMonthPosts = monthPosts.toSorted(
			(a, b) => b.score - a.score
		)
		const sortByLengthMonthPosts = monthPosts.toSorted(
			(a, b) => b.content.length - a.content.length
		)
		const monthPostLikes = postLikes.filter((postLike) =>
			dayjs(postLike.createdAt).isSame(dayjs(), 'month')
		)

		return {
			total: {
				dateCount: dayjs().diff(user.createdAt, 'day'),
				postCount: totalPosts.length,
				contentLengthSum: totalPosts.reduce((acc, post) => {
					return acc + post.content.length
				}, 0),
				maxDateCombo: domain.analysis.calculateMaxCombo(totalPosts),
				positivePostRatio:
					domain.analysis.calculatePositivePostRatio(totalPosts),
				averageEmotionScore: domain.analysis.calculateAverateScore(totalPosts),
				favoriteCount: postLikes.length,
				mostUsedTag: domain.analysis.calculateMostUsedTag(totalPosts),
				mostUsedMediaItem:
					domain.analysis.calculateMostUsedMediaItem(totalPosts),
				mostFrequentTime: domain.analysis.calculateMostFrequentTime(totalPosts),
				maxPositiveEmotionPost: sortByScoreTotalPosts[0],
				maxNegativeEmotionPost:
					sortByScoreTotalPosts[sortByScoreTotalPosts.length - 1],
				maxLengthTextPost: sortByLengthTotalPosts[0],
				minLengthTextPost:
					sortByLengthTotalPosts[sortByLengthTotalPosts.length - 1],
			},
			month: {
				postCount: monthPosts.length,
				contentLengthSum: monthPosts.reduce((acc, post) => {
					return acc + post.content.length
				}, 0),
				// 先月分から連続している可能性があるのでpostsを渡す
				currentCombo: domain.analysis.calculateCurrentCombo(totalPosts),
				positivePostRatio:
					domain.analysis.calculatePositivePostRatio(monthPosts),
				averageEmotionScore: domain.analysis.calculateAverateScore(monthPosts),
				favoriteCount: monthPostLikes.length,
				mostUsedTag: domain.analysis.calculateMostUsedTag(monthPosts),
				mostUsedMediaItem:
					domain.analysis.calculateMostUsedMediaItem(monthPosts),
				maxPositiveEmotionPost: sortByScoreMonthPosts[0],
				maxNegativeEmotionPost:
					sortByScoreMonthPosts[sortByScoreMonthPosts.length - 1],
				maxLengthTextPost: sortByLengthMonthPosts[0],
				minLengthTextPost:
					sortByLengthMonthPosts[sortByLengthMonthPosts.length - 1],
			},
		}
	}
	async getUserQualitative(c: Context, userId: string) {
		const posts = await repo.post.getAllByUserId(c, userId)
		const formattedPostsForPrompt = posts.map((post) => {
			return {
				content: post.content,
				tagPrivate: post.postTags.map((tag) => tag.tag.name),
				tagPublic: post.mediaItem?.title,
				createdAt: post.createdAt,
				score: post.score,
			}
		})
		const result = await api.openAi.analyzeUserQualitativePost(
			c,
			JSON.stringify(formattedPostsForPrompt)
		)
		return result
	}
}

export const analysisSvc = new AnalysisService()
