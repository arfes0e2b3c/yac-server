import dayjs from 'dayjs'

class AnalysisDomain {
	calculateMaxCombo(posts: { date: Date | null }[]) {
		let maxCombo = 0
		let currentCombo = 0
		let lastValidPost = posts[0]
		for (let i = 0; i < posts.length; i++) {
			const diff = dayjs(posts[i].date).diff(lastValidPost.date, 'day')
			if (diff > 1 || i === posts.length - 1) {
				maxCombo = Math.max(maxCombo, currentCombo)
				currentCombo = 0
				lastValidPost = posts[i]
			} else if (diff === 1) {
				currentCombo++
				lastValidPost = posts[i]
			}
		}
		return maxCombo + 1
	}
	calculateCurrentCombo(posts: { date: Date | null }[]) {
		const postsDescDate = posts.toSorted((a, b) =>
			dayjs(a.date).isBefore(b.date) ? 1 : -1
		)
		let maxCombo = 0
		let currentCombo = 0
		let lastValidPost = postsDescDate[0]
		if (
			dayjs(lastValidPost?.date || '')
				.tz('Asia/Tokyo')
				.format('YYYY-MM-DD') !== dayjs().tz('Asia/Tokyo').format('YYYY-MM-DD')
		)
			return 0
		for (let i = 0; i < postsDescDate.length; i++) {
			const diff = dayjs(postsDescDate[i].date).diff(lastValidPost.date, 'day')
			if (diff < -1 || i === postsDescDate.length - 1) {
				maxCombo = Math.max(maxCombo, currentCombo)
				currentCombo = 0
				lastValidPost = postsDescDate[i]
			}
			if (diff === -1) {
				currentCombo++
				lastValidPost = postsDescDate[i]
			}
		}
		return maxCombo + 1
	}
	calculateMostFrequentTime(posts: { createdAt: Date | null }[]) {
		const timeMap: { [key: string]: number } = {}
		for (const post of posts) {
			const hour = dayjs(post.createdAt).tz('Asia/Tokyo').format('HH')
			if (!timeMap[hour]) {
				timeMap[hour] = 1
			} else {
				timeMap[hour]++
			}
		}
		// FIX:ここの初期値無いから後で修正する
		const max = Object.keys(timeMap).reduce(
			(a, b) => (timeMap[a] > timeMap[b] ? a : b),
			''
		)
		return `${max}:00 - ${max}:59`
	}
	calculateMostUsedTag(posts: { postTags: { tag: { name: string } }[] }[]) {
		if (posts.length === 0) return ''
		const tagMap: { [key: string]: number } = {}
		for (const post of posts) {
			for (const { tag } of post.postTags) {
				if (!tagMap[tag.name]) {
					tagMap[tag.name] = 1
				} else {
					tagMap[tag.name]++
				}
			}
		}
		const max = Object.keys(tagMap).reduce(
			(a, b) => (tagMap[a] > tagMap[b] ? a : b),
			''
		)
		return max
	}
	calculateMostUsedMediaItem(posts: { mediaItem: { title: string } | null }[]) {
		const mediaItemMap: { [key: string]: number } = {}
		for (const post of posts) {
			if (!mediaItemMap[post.mediaItem?.title || '']) {
				mediaItemMap[post.mediaItem?.title || ''] = 1
			} else {
				mediaItemMap[post.mediaItem?.title || '']++
			}
		}
		const max = Object.keys(mediaItemMap).reduce((a, b) => {
			if (a === '') return b
			return mediaItemMap[a] > mediaItemMap[b] ? a : b
		}, '')
		return max
	}
	calculatePositivePostRatio(posts: { score: number }[]) {
		const positivePosts = posts.filter((post) => post.score > 0)
		// FIX: 本当はnullで返してクライアントでエラーハンドリングする必要がある。
		return Math.round((positivePosts.length / posts.length) * 100) || 0
	}
	calculateAverateScore(posts: { score: number }[]) {
		return (
			Math.round(
				posts.reduce((acc, post) => {
					return acc + post.score
				}, 0) * 100
			) / 100
		)
	}
}

export const analysisDomain = new AnalysisDomain()
