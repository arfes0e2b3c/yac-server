import { createClient } from '@supabase/supabase-js'
import { Context } from 'hono'
import { env as getEnv } from 'hono/adapter'
import { ReneEnv } from '../types'

class SupabaseApi {
	async deleteUser(c: Context, userId: string) {
		const env = getEnv<ReneEnv>(c)
		const supabaseUrl = env.SUPABASE_URL
		const supabaseServiceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY
		const client = createClient(supabaseUrl, supabaseServiceRoleKey, {
			auth: {
				autoRefreshToken: true,
				persistSession: true,
				detectSessionInUrl: false,
			},
		})

		return await client.auth.admin.deleteUser(userId)
	}
}

export const supabaseApi = new SupabaseApi()
