/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/cloudflare" />
/// <reference types="@cloudflare/workers-types" />

import type { LibSQLDatabase } from "drizzle-orm/libsql";

declare module "@remix-run/server-runtime" {
  export interface AppLoadContext {
    readonly db: LibSQLDatabase;
  }
}
