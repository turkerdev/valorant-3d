import { createClient } from "@libsql/client/web";
import { drizzle } from "drizzle-orm/libsql";

export const createDb = (url: string, authToken: string) => {
  const sqlite = createClient({
    url,
    authToken,
  });

  return drizzle(sqlite);
};
