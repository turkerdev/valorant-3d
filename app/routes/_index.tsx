import { useLoaderData } from "@remix-run/react";
import { eq, sql } from "drizzle-orm";
import { db } from "~/db/db.server";
import { skinlevels, skins } from "~/db/schema.server";

export const loader = async () => {
  const [skin] = db
    .select()
    .from(skins)
    .innerJoin(skinlevels, eq(skins.id, skinlevels.skin))
    .limit(1)
    .orderBy(sql`random()`)
    .all();

  return skin;
};

export default function Index() {
  const skin = useLoaderData<typeof loader>();

  return (
    <div>
      <p key={skin.skins.id}>{skin.skins.name}</p>
      hey <p>yo</p>
    </div>
  );
}
