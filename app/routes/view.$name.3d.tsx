import type { V2_MetaFunction } from "@remix-run/react";
import { useRouteLoaderData } from "@remix-run/react";
import { SkinCanvas } from "~/components/SkinCanvas";
import { type loader as skinLoader } from "~/routes/view.$name";

export const meta: V2_MetaFunction<
  unknown,
  { "routes/view.$name": typeof skinLoader }
> = ({ matches }) => {
  const skinName = matches.find((match) => match.id === "routes/view.$name")
    ?.data.skins.name;

  if (!skinName) {
    return [{ title: `Not Found | 3D SKIN VIEWER` }];
  }

  return [{ title: `${skinName} | 3D SKIN VIEWER` }];
};

export default function View3D() {
  const skin = useRouteLoaderData<typeof skinLoader>("routes/view.$name");

  if (!skin) {
    return <p>Uh oh!</p>;
  }

  return (
    <div className="h-[calc(100vh-3.5rem)]">
      <p className="absolute left-5 bottom-5 text-xl">{skin.skins.name}</p>
      <SkinCanvas attachment={skin.skinlevels.attachment} />
    </div>
  );
}

export function ErrorBoundary() {
  return <h1>Error while loading the skin</h1>;
}
