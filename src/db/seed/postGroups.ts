import { fakerJA as faker } from '@faker-js/faker'
import { SeedDb } from '.'
import { PostGroupsTableSchema, postGroupsTable } from '../schema/postGroups'

export const fakePostGroup: (
	postIds: string[],
	groupIds: string[]
) => PostGroupsTableSchema = (postIds, groupIds) => ({
	postId: postIds[Math.floor(Math.random() * postIds.length)],
	groupId: groupIds[Math.floor(Math.random() * groupIds.length)],
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

export const seedPostGroups = async (postIds: string[], groupIds: string[]) => {
	const postGroupSeeds = [...Array(200)].map(() =>
		fakePostGroup(postIds, groupIds)
	)
	await SeedDb.insert(postGroupsTable)
		.values(postGroupSeeds)
		.onConflictDoNothing()
}
