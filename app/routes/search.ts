import type { LoaderArgs } from "@remix-run/node";
import { eq, like } from "drizzle-orm";
import { db } from "~/db/db.server";
import { skinlevels, skins } from "~/db/schema.server";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  if (!q) {
    return null;
  }

  const found = await db
    .select()
    .from(skins)
    .where(like(skins.name, `%${q}%`))
    .innerJoin(skinlevels, eq(skins.id, skinlevels.skin))
    .limit(5)
    .all();

  return found;
};
