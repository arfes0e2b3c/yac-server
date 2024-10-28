import { defineConfig } from 'drizzle-kit'

export default defineConfig({
	dialect: 'postgresql',
	schema: './src/db/schema.ts',
	out: './drizzle',
	dbCredentials: {
		ssl: false,
		host: process.env.DB_HOST || 'localhost',
		user: process.env.DB_USER || 'root',
		password: process.env.DB_PASSWORD || 'password',
		port: Number(process.env.DB_PORT) || 5432,
		database: process.env.DB_NAME || 'testdb',
	},
})
