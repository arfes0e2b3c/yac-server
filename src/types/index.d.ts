import { z } from 'zod'

const reneEnv = z.object({
	DB_HOST: z.string(),
	DB_USER: z.string(),
	DB_PASSWORD: z.string(),
	DB_PORT: z.number(),
	DB_NAME: z.string(),
	OPENAI_API_KEY: z.string(),
	S3_BUCKET_NAME: z.string(),
	AWS_ACCESS_KEY_ID: z.string(),
	AWS_SECRET_ACCESS_KEY: z.string(),
	CLOUDFRONT_BASE_URL: z.string(),
	POST_CONTENT_CRYPT_KEY: z.string(),
})

export type ReneEnv = z.infer<typeof reneEnv>
