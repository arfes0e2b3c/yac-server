import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Context } from 'hono'
import { env as getEnv } from 'hono/adapter'
import { ulid } from 'ulid'
import { MediaItemSchema } from '../../openapi/mediaItem'
import { ReneEnv } from '../types'

class S3Api {
	async generatePresignedUrl(c: Context) {
		const env = getEnv<ReneEnv>(c)
		const client = new S3Client({
			region: 'ap-northeast-1',
			credentials: {
				accessKeyId: env.AWS_ACCESS_KEY_ID,
				secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
			},
		})
		const key = ulid()
		const url = await getSignedUrl(
			client,
			new PutObjectCommand({
				Bucket: env.S3_BUCKET_NAME || '',
				Key: key,
				ContentType: 'image/webp',
			})
		)
		return { url, key }
	}
	async transferS3fromSupabaseStrorage(
		c: Context,
		mediaItems: MediaItemSchema[]
	) {
		const env = getEnv<ReneEnv>(c)

		const uploadedImages: MediaItemSchema[] = []
		for (const mediaItem of mediaItems) {
			const imageRes = await fetch(mediaItem.imageUrl)
			const arrayBuffer = await imageRes.arrayBuffer()
			const buffer = Buffer.from(arrayBuffer)
			const client = new S3Client({
				region: 'ap-northeast-1',
				credentials: {
					accessKeyId: env.AWS_ACCESS_KEY_ID,
					secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
				},
			})
			const key = ulid()
			const res = await client.send(
				new PutObjectCommand({
					Bucket: env.S3_BUCKET_NAME || '',
					Key: key,
					Body: Buffer.from(buffer),
					ContentType: 'image/webp',
				})
			)
			uploadedImages.push({
				...mediaItem,
				imageUrl: `${env.CLOUDFRONT_BASE_URL}/${key}`,
			})
		}

		return uploadedImages
	}
}

export const s3Api = new S3Api()
