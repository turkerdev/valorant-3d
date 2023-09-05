import type { LoaderArgs } from "@remix-run/node";
import { Link, useFetcher } from "@remix-run/react";
import { eq, like } from "drizzle-orm";
import throttle from "lodash.throttle";
import { useMemo } from "react";
import { db } from "~/db/db.server";
import { skinlevels, skins } from "~/db/schema.server";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  if (!q) {
    return null;
  }

  const found = db
    .select()
    .from(skins)
    .where(like(skins.name, `%${q}%`))
    .innerJoin(skinlevels, eq(skins.id, skinlevels.skin))
    .limit(5)
    .all();

  return found;
};

type Props = {
  className?: string;
};

export const Search = ({ className }: Props) => {
  const fetcher = useFetcher<typeof loader>();
  const fetch = useMemo(() => throttle(fetcher.submit, 400), [fetcher.submit]);

  return (
    <div>
      <fetcher.Form
        method="get"
        action="/search"
        onChange={(e) => fetch(e.currentTarget)}
      >
        <input
          className="p-1 rounded text-black"
          type="text"
          name="q"
          placeholder="Search"
        />
      </fetcher.Form>
      {fetcher.data && (
        <div className="z-10 flex flex-col absolute bg-neutral-700">
          {fetcher.data?.map((s, i) => (
            <SearchResult key={i} name={s.skins.name} />
          ))}
        </div>
      )}

      {/* {fetcher.data ? (
        <div style={{ display: "flex", gap: "6px" }}>
         
        </div>
      ) : (
        <></>
      )} */}
    </div>
  );
};

type SearchResultProps = {
  name: string;
};

const SearchResult = ({ name }: SearchResultProps) => {
  return (
    <>
      <Link className="hover:text-white" to={`/?q=${name}`}>
        {name}
      </Link>
    </>
  );
};
