import { type LoaderArgs } from "@remix-run/node";
import { Outlet, isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { db } from "~/db/db.server";
import { skinlevels, skins } from "~/db/schema.server";
import { Random } from "~/features/skin/Random";
import { Search } from "~/features/skin/Search";

export const loader = async ({ request, params }: LoaderArgs) => {
  const name = params.name;

  if (!name) {
    throw new Response("Not Found", { status: 404 });
  }

  const [skin] = await db
    .select()
    .from(skins)
    .where(eq(skins.name, name))
    .innerJoin(skinlevels, eq(skins.id, skinlevels.skin))
    .limit(1)
    .all();

  if (!skin) {
    throw new Response("Not Found", { status: 404 });
  }

  return skin;
};

export default function View() {
  return (
    <>
      <header className="flex p-1 items-center gap-2">
        <Search />
        <Random />
      </header>
      <Outlet />
    </>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  }

  return <h1>Unknown Error</h1>;
}
