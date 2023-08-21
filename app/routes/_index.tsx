import { useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { db } from "~/db/db.server";
import { skinlevels, skins } from "~/db/schema.server";

export const loader = async () => {
  const skinLevels = db
    .select()
    .from(skins)
    .innerJoin(skinlevels, eq(skins.id, skinlevels.skin));

  return skinLevels.all();
};

export default function Index() {
  const skins = useLoaderData<typeof loader>();

  return (
    <div>
      {skins.map((skin) => (
        <p key={skin.skins.id}>{skin.skins.name}</p>
      ))}
      hey <p>yo</p>
    </div>
  );
}
