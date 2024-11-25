import {} from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { seedMediaItems } from './mediaItems'
import { seedPostTags } from './postTags'
import { seedPosts } from './posts'
import { seedTags } from './tags'
import { seedUsers } from './users'

const client = new Pool({
	host: process.env.DB_HOST || 'localhost',
	user: process.env.DB_USER || 'root',
	password: process.env.DB_PASSWORD || 'password',
	port: Number(process.env.DB_PORT) || 5432,
	database: process.env.DB_NAME || 'testdb',
})

export const SeedDb = drizzle(client)

const seed = async () => {
	const userIds = await seedUsers()
	const mediaItemIds = await seedMediaItems()
	const tagIds = await seedTags(userIds)
	const postIds = await seedPosts(userIds, mediaItemIds)
	await seedPostTags(postIds, tagIds)
}

seed()
	.then(() => {
		console.log('Seed data successfully inserted.')
	})
	.catch((error) => {
		console.error('Error seeding data:', error)
	})
	.finally(() => {
		client.end()
	})
