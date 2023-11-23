import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { Form } from "@remix-run/react";
import { eq, sql } from "drizzle-orm";
import { skinlevels, skins } from "~/db/schema.server";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const [skin] = await context.db
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

export const Random = () => {
  return (
    <Form action="/random">
      <button className="text-black rounded px-2 bg-white">Random</button>
    </Form>
  );
};
