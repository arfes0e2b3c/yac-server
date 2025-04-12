import { createRoute, z } from '@hono/zod-openapi'
import { zDate, zString } from './common'

export const userBlockSchema = z.object({
  id: zString('01J8F3RR15SSSVV2F3AGMJ4ZE7').max(36),
  blockerId: zString('01J8F3CJR0NJM89W64KYWSEJVA').describe('ブロックしたユーザーのID'),
  blockedId: zString('01J8F3CJR0NJM89W64KYWSEJVA').describe('ブロックされたユーザーのID'),
  createdAt: zDate('2024-09-23 07:57:06'),
  updatedAt: zDate('2024-09-23 07:57:06'),
})

const createOrDeleteUserBlockSchema = z.object({
  userId: zString('01J8F3CJR0NJM89W64KYWSEJVA').describe('ブロックするユーザーのID'),
  blockedId: zString('01J8F3CJR0NJM89W64KYWSEJVA').describe('ブロックするユーザーのID'),
})

export type UserBlockSchema = z.infer<typeof userBlockSchema>
export type CreateOrDeleteUserBlockSchema = z.infer<typeof createOrDeleteUserBlockSchema>

export const createUserBlockRoute = createRoute({
  path: '/user-blocks',
  method: 'post',
  description: '新しいユーザーブロックを作成',
  operationId: 'createUserBlock',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: createOrDeleteUserBlockSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'ユーザーブロックが正常に作成されました',
      content: {
        'application/json': {
          schema: userBlockSchema,
        },
      },
    },
    400: {
      description: '無効なリクエスト',
    },
    401: {
      description: '認証エラー',
    },
    404: {
      description: 'ブロックするユーザーが見つかりません',
    },
  },
})

export const deleteUserBlockRoute = createRoute({
  path: '/user-blocks/{blockedId}',
  method: 'delete',
  description: 'ユーザーブロックを解除',
  operationId: 'deleteUserBlock',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: createOrDeleteUserBlockSchema,
        },
      },
    },
  },
  responses: {
    204: {
      description: 'ユーザーブロックが正常に解除されました',
    },
    401: {
      description: '認証エラー',
    },
    404: {
      description: 'ブロックが見つかりません',
    },
  },
})

export const listUserBlocksRoute = createRoute({
  path: '/user-blocks',
  method: 'get',
  description: 'ブロックしているユーザー一覧を取得',
  operationId: 'listUserBlocks',
  request: {
    query: z.object({
      page: z.string().optional().describe('ページ番号'),
      limit: z.string().optional().describe('1ページあたりの件数'),
    }),
    body: {
      required: true,
      content: {
        'application/json': {
          schema: z.object({
            userId: zString('01J8F3CJR0NJM89W64KYWSEJVA').describe('ブロックしているユーザーのID'),

          })
        },
      }
    }
  },
  responses: {
    200: {
      description: 'ブロックユーザー一覧の取得に成功',
      content: {
        'application/json': {
          schema: z.object({
            items: z.array(userBlockSchema),
            total: z.number(),
            page: z.number(),
            limit: z.number(),
            hasMore: z.boolean(),
          }),
        },
      },
    },
    401: {
      description: '認証エラー',
    },
  },
})
