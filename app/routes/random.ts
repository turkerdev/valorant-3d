import { redirect } from "@remix-run/node";
import { eq, sql } from "drizzle-orm";
import { db } from "~/db/db.server";
import { skinlevels, skins } from "~/db/schema.server";

export const loader = async () => {
  const [skin] = await db
    .select({ name: skins.name })
    .from(skins)
    .innerJoin(skinlevels, eq(skins.id, skinlevels.skin))
    .limit(1)
    .orderBy(sql`random()`)
    .all();

  if (!skin) {
    throw new Response("No skin found", { status: 404 });
  }

  return redirect(`/view/${encodeURIComponent(skin.name)}`);
};
