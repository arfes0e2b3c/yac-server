import { Context } from 'hono'
import { api } from '../api'

class ApiService {
	async evaluateSentiment(c: Context, text: string) {
		return await api.openAi.evaluateSentiment(c, text)
	}
	async generatePresignedUrl(c: Context) {
		return await api.s3.generatePresignedUrl(c)
	}
}

export const apiService = new ApiService()
