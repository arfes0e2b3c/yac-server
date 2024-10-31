import type { Context, Env, Input, Next } from 'hono'
import { HTTPException } from 'hono/http-exception'

class ValidationError extends Error {}
class DatabaseError extends Error {}

export const handleErrors = async <
	E extends Env,
	P extends string,
	I extends Input,
	R,
>(
	fn: (c: Context<E, P, I>, next: Next) => Promise<R>,
	c: Context<E, P, I>
): Promise<R> => {
	try {
		return await fn(c, async () => {})
	} catch (err) {
		console.error(`Error in ${c.req.path}:`, err)

		if (err instanceof HTTPException) {
			throw err
		}

		if (err instanceof ValidationError) {
			throw new HTTPException(400, {
				message: `Validation error in ${c.req.path}: ${err}`,
			})
		}

		if (err instanceof DatabaseError) {
			throw new HTTPException(500, {
				message: `Database error in ${c.req.path}: ${err}`,
			})
		}

		throw new HTTPException(500, {
			message: `An unexpected error occurred in ${c.req.path}`,
		})
	}
}
