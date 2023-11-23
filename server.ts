import { logDevReady } from "@remix-run/cloudflare";
import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
import * as build from "@remix-run/dev/server-build";
import { createDb } from "~/db/db.server";

if (process.env.NODE_ENV === "development") {
  logDevReady(build);
}

export const onRequest = createPagesFunctionHandler({
  build,
  getLoadContext: (context) => ({
    env: context.env,
    db: createDb(context.env.SQLITE_URL, context.env.SQLITE_AUTH_TOKEN),
  }),
  mode: build.mode,
});
