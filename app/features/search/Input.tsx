import { Link, useFetcher } from "@remix-run/react";
import throttle from "lodash.throttle";
import { useMemo } from "react";
import type { loader } from "./loader";

export const Search = () => {
  const fetcher = useFetcher<typeof loader>();
  const fetch = useMemo(() => throttle(fetcher.submit, 400), [fetcher.submit]);

  return (
    <div>
      <fetcher.Form
        method="get"
        action="/search"
        onChange={(e) => fetch(e.currentTarget)}
      >
        <input type="text" name="q" placeholder="Search" />
      </fetcher.Form>
      {fetcher.data ? (
        <div style={{ display: "flex", gap: "6px" }}>
          {fetcher.data.map((s, i) => (
            <Link key={i} to={`/?q=${s.skins.name}`}>
              {s.skins.name}
            </Link>
          ))}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
