import { Context } from 'hono'
import { api } from '../api'

class ApiService {
	async evaluateSentiment(c: Context, text: string) {
		return await api.openAi.evaluateSentiment(c, text)
	}
}

export const apiService = new ApiService()
