import { pgTable, serial, text, timestamp, unique } from "drizzle-orm/pg-core";
import { usersTable } from "./users"; // 既存のusersスキーマをインポート
import { userBlocks } from "../migrations/0001_user_blocks";

export const userBlocksTable = pgTable(
  "user_blocks",
  {
    id: serial("id").primaryKey(),
    blockerId: text("blocker_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    blockedId: text("blocked_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      blockerBlockedUnique: unique().on(table.blockerId, table.blockedId),
    };
  }
);

// ブロック関係のタイプ定義
export type UserBlockTable = typeof userBlocks.$inferSelect;
export type NewUserBlockTable = typeof userBlocks.$inferInsert; 