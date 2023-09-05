import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { eq, sql } from "drizzle-orm";
import { db } from "~/db/db.server";
import { skinlevels, skins } from "~/db/schema.server";

export const loader = ({ request }: LoaderArgs) => {
  const [skin] = db
    .select({ name: skins.name })
    .from(skins)
    .innerJoin(skinlevels, eq(skins.id, skinlevels.skin))
    .limit(1)
    .orderBy(sql`random()`)
    .all();

  if (!skin) {
    throw new Response("No skin found", { status: 404 });
  }

  const url = new URL(request.url);
  url.pathname = "/";
  url.searchParams.set("q", skin.name);
  return redirect(url.toString());
};

export const Random = () => {
  return (
    <Form method="get" action="/random">
      <button className="text-black rounded px-2 bg-white">Random</button>
    </Form>
  );
};
