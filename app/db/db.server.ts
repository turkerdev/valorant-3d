import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

const sqlite = createClient({
  url: process.env.TURSO_DB_URL || "file:app/db/sqlite.db",
  authToken: process.env.TURSO_DB_AUTH_TOKEN || undefined,
});
export const db = drizzle(sqlite);
