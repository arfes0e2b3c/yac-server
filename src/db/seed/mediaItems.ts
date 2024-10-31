import { fakerJA as faker } from '@faker-js/faker'
import { ulid } from 'ulid'
import { SeedDb } from '.'
import { MediaItemsTableSchema, mediaItemsTable } from '../schema/mediaItems'

export const fakeMediaItems: () => MediaItemsTableSchema = () => ({
	id: ulid(),
	title: faker.lorem.word(),
	imageUrl: faker.image.url({ width: 640, height: 480 }),
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

export const seedMediaItems = async () => {
	const mediaItemSeeds = [...Array(30)].map(fakeMediaItems)
	await SeedDb.insert(mediaItemsTable)
		.values(mediaItemSeeds)
		.onConflictDoNothing()
	return mediaItemSeeds.map((mediaItem) => {
		return mediaItem.id
	})
}
