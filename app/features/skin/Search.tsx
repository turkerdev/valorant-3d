import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Link, useFetcher } from "@remix-run/react";
import { eq, like } from "drizzle-orm";
import throttle from "lodash.throttle";
import { useMemo } from "react";
import { skinlevels, skins } from "~/db/schema.server";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  if (!q) {
    return null;
  }

  const found = await context.db
    .select()
    .from(skins)
    .where(like(skins.name, `%${q}%`))
    .innerJoin(skinlevels, eq(skins.id, skinlevels.skin))
    .limit(5)
    .all();

  return found;
};

export const Search = () => {
  const fetcher = useFetcher<typeof loader>();
  const fetch = useMemo(() => throttle(fetcher.submit, 400), [fetcher.submit]);
  const busy = fetcher.state === "submitting";

  return (
    <div>
      <fetcher.Form action="/search" onChange={(e) => fetch(e.currentTarget)}>
        <input
          className="p-1 rounded text-black"
          type="text"
          name="q"
          placeholder="Search"
        />
      </fetcher.Form>
      {fetcher.data || busy ? (
        <div className="z-10 flex flex-col absolute bg-neutral-700">
          {busy ? (
            <div>Searching...</div>
          ) : (
            fetcher.data?.map((s, i) => (
              <SearchResult key={i} name={s.skins.name} />
            ))
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

type SearchResultProps = {
  name: string;
};

const SearchResult = ({ name }: SearchResultProps) => {
  return (
    <Link className="hover:text-white" to={`/view/${encodeURIComponent(name)}`}>
      {name}
    </Link>
  );
};
