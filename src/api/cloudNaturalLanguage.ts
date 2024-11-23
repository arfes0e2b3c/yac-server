import { Context } from 'hono'
import { env as getEnv } from 'hono/adapter'
import { Env } from '../types'

class CloudNaturalLanguage {
	async evaluateSentiment(c: Context, text: string) {
		const googleCloudNaturalLanguageApiKey =
			getEnv<Env>(c).GOOGLE_CLOUD_NATURAL_LANGUAGE_API_KEY
		const res = await fetch(
			`https://language.googleapis.com/v1/documents:analyzeSentiment?key=${googleCloudNaturalLanguageApiKey}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					document: {
						type: 'PLAIN_TEXT',
						content: text,
					},
				}),
			}
		)

		if (!res.ok) {
			throw new Error(`Failed to analyze sentiment: ${res.statusText}`)
		}

		const result = (await res.json()) as {
			documentSentiment: {
				score: number
				magnitude: number
			}
		}
		const sentiment = result.documentSentiment
		return (sentiment.score || 0) * (sentiment.magnitude || 0)
	}
}

export const cloudNaturalLanguage = new CloudNaturalLanguage()
