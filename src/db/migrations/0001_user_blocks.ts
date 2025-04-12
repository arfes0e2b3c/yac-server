import { pgTable, serial, text, timestamp, unique } from "drizzle-orm/pg-core";

export const userBlocks = pgTable(
  "user_blocks",
  {
    id: serial("id").primaryKey(),
    blockerId: text("blocker_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    blockedId: text("blocked_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      // 同じユーザーの組み合わせでのブロックは一つだけ
      blockerBlockedUnique: unique().on(table.blockerId, table.blockedId),
    };
  }
);

// 既存のusersテーブルの参照（実際のスキーマに合わせて調整してください）
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  // ... 他のユーザーフィールド
}); 