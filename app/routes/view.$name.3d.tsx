import { useRouteLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { SkinCanvas } from "~/features/skin/Canvas.client";
import { type loader as skinLoader } from "~/routes/view.$name";

let isHydrating = true;

export default function View3D() {
  const [isHydrated, setIsHydrated] = useState(!isHydrating);
  const skin = useRouteLoaderData<typeof skinLoader>("routes/view.$name");

  useEffect(() => {
    isHydrating = false;
    setIsHydrated(true);
  }, []);

  if (!skin) {
    return <p>Uh oh!</p>;
  }

  if (isHydrated) {
    return (
      <>
        <p className="absolute left-5 bottom-5 text-xl text-white">
          {skin.skins.name}
        </p>
        <SkinCanvas attachment={skin.skinlevels.attachment} />
      </>
    );
  } else {
    return <>Loading</>;
  }
}

export function ErrorBoundary() {
  return <h1>Error while loading the skin</h1>;
}
