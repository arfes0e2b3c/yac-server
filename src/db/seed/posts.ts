import { fakerJA as faker } from '@faker-js/faker'
import { ulid } from 'ulid'
import { SeedDb } from '.'
import { PostsTableSchema, postsTable } from '../schema/posts'

export const fakePost: (
	userIds: string[],
	mediaItemIds: string[]
) => PostsTableSchema = (userIds, mediaItemIds) => ({
	id: ulid(),
	content: faker.lorem.sentence(),
	locationLabel: faker.location.city(),
	locationPoint: [faker.location.latitude(), faker.location.longitude()],
	imageUrl: faker.image.url({ width: 640, height: 480 }),
	relatedUrl: faker.internet.url(),

	userId: userIds[Math.floor(Math.random() * userIds.length)],
	mediaItemId: mediaItemIds[Math.floor(Math.random() * mediaItemIds.length)],
	visibility: faker.helpers.arrayElement([
		'private',
		'public',
		'only_followers',
	]),
	date: faker.date.between({
		from: '2023-01-01T00:00:00.000Z',
		to: '2024-09-01T00:00:00.000Z',
	}),
	createdAt: faker.date.between({
		from: '2023-01-01T00:00:00.000Z',
		to: '2024-08-01T00:00:00.000Z',
	}),
	updatedAt: faker.date.between({
		from: '2024-08-01T00:00:00.000Z',
		to: '2024-09-01T00:00:00.000Z',
	}),
	deletedAt: null,
	score: 0,
})

export const seedPosts = async (userIds: string[], mediaItemIds: string[]) => {
	const postSeeds = [...Array(200)].map(() => fakePost(userIds, mediaItemIds))
	await SeedDb.insert(postsTable).values(postSeeds).onConflictDoNothing()
	return postSeeds.map((post) => {
		return post.id
	})
}
