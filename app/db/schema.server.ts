import { index, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const skins = sqliteTable("skins", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});

export const skinlevels = sqliteTable(
  "skinlevels",
  {
    id: text("id").primaryKey(),
    skin: text("skin_id").references(() => skins.id),
    attachment: text("attachment").notNull(),
  },
  (table) => {
    return {
      attachmentIdx: index("attachment_idx").on(table.attachment),
    };
  }
);
