import path from 'path'
import { defineConfig } from 'drizzle-kit'
import fg from 'fast-glob'

const schemaFiles = fg
	.sync('./src/db/schema/**/*.ts')
	.map((file) => path.resolve(file))

export default defineConfig({
	dialect: 'postgresql',
	schema: schemaFiles,
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
