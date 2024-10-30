import { fakerJA as faker } from '@faker-js/faker'
import { ulid } from 'ulid'
import { SeedDb } from '.'
import { TagsTableSchema, tagsTable } from '../schema/tags'

export const fakeTag: (userIds: string[]) => TagsTableSchema = (userIds) => ({
	id: ulid(),
	name: faker.person.fullName(),
	createdAt: faker.date.between({
		from: '2023-01-01T00:00:00.000Z',
		to: '2024-08-01T00:00:00.000Z',
	}),
	updatedAt: faker.date.between({
		from: '2024-08-01T00:00:00.000Z',
		to: '2024-09-01T00:00:00.000Z',
	}),
	deletedAt: null,
	userId: userIds[Math.floor(Math.random() * userIds.length)],
})

export const seedTags = async (userIds: string[]) => {
	const tagSeeds = [...Array(100)].map(() => fakeTag(userIds))
	await SeedDb.insert(tagsTable).values(tagSeeds).onConflictDoNothing()
	return tagSeeds.map((tag) => {
		return tag.id
	})
}
