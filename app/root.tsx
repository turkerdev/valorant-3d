import { json, type LinksFunction } from "@remix-run/node";
import type { V2_MetaFunction } from "@remix-run/react";
import {
  Form,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useFetcher,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  CommandDialog,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { cn } from "~/lib/utils";
import type { loader as searchLoader } from "~/routes/search";
import stylesheet from "./tailwind.css";

export const meta: V2_MetaFunction = () => [
  { title: "VALORANT 3D SKIN VIEWER" },
  { name: "description", content: "A 3D skin viewer for VALORANT" },
];

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export const loader = async () => {
  return json({ gaTrackingId: process.env.GA_TRACKING_ID });
};

export default function App() {
  const { gaTrackingId } = useLoaderData<typeof loader>();
  const [open, setOpen] = useState(false);
  const fetcher = useFetcher<typeof searchLoader>();
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen">
        <div className="flex items-center border-b p-1 gap-3 justify-between sticky top-0 h-14">
          <Form action="/random">
            <Button variant="outline">Random</Button>
          </Form>
          <Button
            variant="outline"
            className={cn(
              "relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
            )}
            onClick={() => setOpen(true)}
          >
            <span className="hidden lg:inline-flex">Search skins...</span>
            <span className="inline-flex lg:hidden">Search...</span>
            <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">CTRL</span>K
            </kbd>
          </Button>

          <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput
              placeholder="Elderflame Operator"
              onValueChange={(q) => {
                fetcher.load(`/search?q=${encodeURIComponent(q)}`);
              }}
            />
            <CommandList>
              {fetcher.data?.map((res) => (
                <>
                  <CommandItem
                    onSelect={() => {
                      navigate(`/view/${encodeURIComponent(res.skins.name)}`);
                      setOpen(false);
                    }}
                  >
                    {res.skins.name}
                  </CommandItem>
                </>
              ))}
            </CommandList>
          </CommandDialog>
          <p className="text-sm text-muted-foreground">
            You will encounter lots of bugs.
          </p>
        </div>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        {process.env.NODE_ENV === "development" || !gaTrackingId ? null : (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
            />
            <script
              async
              id="gtag-init"
              dangerouslySetInnerHTML={{
                __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', '${gaTrackingId}');
              `,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}
