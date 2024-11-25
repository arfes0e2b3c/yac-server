import { z } from 'zod'

const zEnv = z.object({
	DB_HOST: z.string(),
	DB_USER: z.string(),
	DB_PASSWORD: z.string(),
	DB_PORT: z.number(),
	DB_NAME: z.string(),
	GOOGLE_CLOUD_NATURAL_LANGUAGE_API_KEY: z.string(),
})

// FIXME: アプリの名前が決まったら固有の名前に変更する
export type Env = z.infer<typeof zEnv>
