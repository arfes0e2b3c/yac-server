import { and, count, eq, or, } from 'drizzle-orm'
import { Context } from 'hono'
import { withDbConnection } from '../db/connection'
import { userBlocksTable } from '../db/schema/userBlocks'


class UserBlockRepository {
  async getByBlockerAndBlocked(c: Context, blockerId: string, blockedId: string) {
    return withDbConnection(c, async (db) => {
      const result = await db
        .select()
        .from(userBlocksTable)
        .where(
          and(
            eq(userBlocksTable.blockerId, blockerId),
            eq(userBlocksTable.blockedId, blockedId)
          )
        )
        .limit(1)

      return result[0]
    })
  }

  async create(c: Context, blockerId: string, blockedId: string) {
    return withDbConnection(c, async (db) => {
      const now = new Date()
      const [result] = await db
        .insert(userBlocksTable)
        .values({
          blockerId,
          blockedId,
          createdAt: now,
          updatedAt: now,
        })
        .returning()

      return result
    })
  }

  async delete(c: Context, blockerId: string, blockedId: string) {
    return withDbConnection(c, async (db) => {
      await db
        .delete(userBlocksTable)
        .where(
          and(
            eq(userBlocksTable.blockerId, blockerId),
            eq(userBlocksTable.blockedId, blockedId)
          )
        )
    })
  }

  async getAllByBlockerId(c: Context, blockerId: string, limit: number, offset: number) {
    return withDbConnection(c, async (db) => {
      return await db
        .select()
        .from(userBlocksTable)
        .where(eq(userBlocksTable.blockerId, blockerId))
        .limit(limit)
        .offset(offset)
        .orderBy(userBlocksTable.createdAt)
    })
  }

  async countByBlockerId(c: Context, blockerId: string) {
    return withDbConnection(c, async (db) => {
      const result = await db
        .select({ count: count() })
        .from(userBlocksTable)
        .where(eq(userBlocksTable.blockerId, blockerId))

      return Number(result[0].count)
    })
  }

  // 相互ブロック関係を確認するためのメソッド
  async isMutuallyBlocked(c: Context, userId1: string, userId2: string) {
    return withDbConnection(c, async (db) => {
      const blocks = await db
        .select()
        .from(userBlocksTable)
        .where(
          or(
            and(
              eq(userBlocksTable.blockerId, userId1),
              eq(userBlocksTable.blockedId, userId2)
            ),
            and(
              eq(userBlocksTable.blockerId, userId2),
              eq(userBlocksTable.blockedId, userId1)
            )
          )
        )

      return blocks.length > 0
    })
  }
}

export const userBlockRepo = new UserBlockRepository()
