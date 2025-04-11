import { openAiApi as openAi } from './openAi'
import { s3Api as s3 } from './s3'
import { supabaseApi as supabase } from './supabase'

export const api = {
	openAi,
	s3,
	supabase,
}
