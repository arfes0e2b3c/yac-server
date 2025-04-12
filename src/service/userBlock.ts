import { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { repo } from '../repository'

class UserBlockService {
  async create(c: Context, blockerId: string, blockedId: string) {
    // 自分自身をブロックすることはできない
    if (blockerId === blockedId) {
      throw new HTTPException(400, { message: '自分自身をブロックすることはできません' })
    }

    // ブロック対象のユーザーが存在するか確認
    const blockedUser = await repo.user.getById(c, blockedId)
    if (!blockedUser) {
      throw new HTTPException(404, { message: 'ブロック対象のユーザーが見つかりません' })
    }

    // 既にブロックしているか確認
    const existingBlock = await repo.userBlock.getByBlockerAndBlocked(c, blockerId, blockedId)
    if (existingBlock) {
      return existingBlock // 既にブロックしている場合は既存のブロック情報を返す
    }

    // 新しいブロックを作成
    return await repo.userBlock.create(c, blockerId, blockedId)
  }

  async delete(c: Context, blockerId: string, blockedId: string) {
    // ブロックが存在するか確認
    const block = await repo.userBlock.getByBlockerAndBlocked(c, blockerId, blockedId)
    if (!block) {
      throw new HTTPException(404, { message: 'ブロック情報が見つかりません' })
    }

    // ブロックを削除
    return await repo.userBlock.delete(c, blockerId, blockedId)
  }

  async getAll(c: Context, userId: string, page: number, limit: number) {
    // ユーザーが存在するか確認
    const user = await repo.user.getById(c, userId)
    if (!user) {
      throw new HTTPException(404, { message: 'ユーザーが見つかりません' })
    }

    // ブロック一覧を取得
    const offset = (page - 1) * limit
    const blocks = await repo.userBlock.getAllByBlockerId(c, userId, limit, offset)
    const total = await repo.userBlock.countByBlockerId(c, userId)

    return {
      items: blocks,
      total,
      page,
      limit,
      hasMore: offset + blocks.length < total
    }
  }

  async checkBlock(c: Context, blockerId: string, userId: string) {
    // ブロックしているか確認
    const block = await repo.userBlock.getByBlockerAndBlocked(c, blockerId, userId)
    
    return {
      isBlocked: !!block,
      blockInfo: block || undefined
    }
  }
}

export const userBlockSvc = new UserBlockService()
