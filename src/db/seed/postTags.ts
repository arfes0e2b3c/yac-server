import { fakerJA as faker } from '@faker-js/faker'
import { SeedDb } from '.'
import { PostTagsTableSchema, postTagsTable } from '../schema/postGroups'

export const fakePostTag: (
	postIds: string[],
	tagIds: string[]
) => PostTagsTableSchema = (postIds, tagIds) => ({
	postId: postIds[Math.floor(Math.random() * postIds.length)],
	tagId: tagIds[Math.floor(Math.random() * tagIds.length)],
	createdAt: faker.date.between({
		from: '2023-01-01T00:00:00.000Z',
		to: '2024-08-01T00:00:00.000Z',
	}),
	updatedAt: faker.date.between({
		from: '2024-08-01T00:00:00.000Z',
		to: '2024-09-01T00:00:00.000Z',
	}),
	deletedAt: null,
})

export const seedPostTags = async (postIds: string[], tagIds: string[]) => {
	const postTagSeeds = [...Array(200)].map(() => fakePostTag(postIds, tagIds))
	await SeedDb.insert(postTagsTable).values(postTagSeeds).onConflictDoNothing()
}
