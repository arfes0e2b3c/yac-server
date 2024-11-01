import { fakerJA as faker } from '@faker-js/faker'
import { ulid } from 'ulid'
import { SeedDb } from '.'
import { UsersTableSchema, usersTable } from '../schema/users'

export const fakeUser: () => UsersTableSchema = () => ({
	id: ulid(),
	name: faker.person.fullName(),
	userCode: faker.internet.username(),
	bio: faker.lorem.sentence(),
	createdAt: faker.date.between({
		from: '2023-01-01T00:00:00.000Z',
		to: '2024-08-01T00:00:00.000Z',
	}),
	updatedAt: faker.date.between({
		from: '2024-08-01T00:00:00.000Z',
		to: '2024-09-01T00:00:00.000Z',
	}),
	lastLoginedAt: faker.date.between({
		from: '2024-09-01T00:00:00.000Z',
		to: '2024-10-01T00:00:00.000Z',
	}),
	deletedAt: null,
})

const users = [
	{ id: ulid(), name: 'Alice', userCode: 'alice', bio: 'Alice bio' },
]

export const seedUsers = async () => {
	const userSeeds = [...Array(30)].map(fakeUser)
	await SeedDb.insert(usersTable).values(userSeeds).onConflictDoNothing()
	return userSeeds.map((user) => {
		return user.id
	})
}
