import { relations, sql } from 'drizzle-orm'
import { boolean, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'
import { ulid } from 'ulid'
import { usersTable } from './users'

export const userSettingsTable = pgTable('user_settings', {
	id: varchar('id', { length: 36 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => ulid()),
	userId: varchar('user_id', { length: 36 })
		.notNull()
		.references(() => usersTable.id, {
			onDelete: 'no action',
		}),
	deviceToken: varchar('device_token', { length: 255 }),
	notificationTime: varchar('notification_time', { length: 5 })
		.default('22:00')
		.notNull(),
	notificationEnabled: boolean('notification_enabled').default(true).notNull(),
	createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp('updated_at')
		.default(sql`CURRENT_TIMESTAMP`)
		.$onUpdate(() => sql`CURRENT_TIMESTAMP`)
		.notNull(),
})

export const userSettingsRelation = relations(userSettingsTable, ({ one }) => ({
	user: one(usersTable, {
		fields: [userSettingsTable.userId],
		references: [usersTable.id],
	}),
}))

export type UserSettingsTableSchema = typeof userSettingsTable.$inferSelect
