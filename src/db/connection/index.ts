import { drizzle } from 'drizzle-orm/node-postgres'
import { Context } from 'hono'
import { env as getEnv } from 'hono/adapter'
import { Client } from 'pg'
import { Env } from '../../types'
import { schema } from '../schema'

const getDbConnection = (env: Env) => {
	const client = new Client({
		host: env.DB_HOST || 'localhost',
		user: env.DB_USER || 'root',
		password: env.DB_PASSWORD || 'password',
		port: Number(env.DB_PORT) || 5432,
		database: env.DB_NAME || 'testdb',
	})

	client.connect()

	return { db: drizzle(client, { schema }), client }
}

export const withDbConnection = async <T>(
	c: Context,
	fn: (db: ReturnType<typeof getDbConnection>['db']) => Promise<T>
) => {
	const env = getEnv<Env>(c)
	const { db, client } = getDbConnection(env)
	try {
		return await fn(db)
	} catch (error) {
		console.error('Database query error:', error)
		throw error
	} finally {
		client.end()
	}
}
