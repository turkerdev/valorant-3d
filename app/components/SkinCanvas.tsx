import { OrbitControls } from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { GunModel } from "~/components/GunModel";
import { GunTexture } from "~/components/GunTexture";
import { Progress } from "~/components/ui/progress";
import { PSKLoader } from "~/pskLoader";

let isHydrating = true;

export const SkinCanvas = ({ attachment }: { attachment: string }) => {
  const [isHydrated, setIsHydrated] = useState(!isHydrating);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    isHydrating = false;
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return <>Loading...</>;
  }

  const { geometry, skeleton, textures } = useLoader(
    PSKLoader,
    attachment + "_LOD0.psk",
    (loader) => {
      loader.setResourcePath("https://valorantskins.turker.dev");
    },
    (e) => {
      console.log(e.loaded / e.total);
      setProgress((e.loaded / e.total) * 100);
    }
  );

  return (
    <>
      {progress < 100 && <Progress value={progress} className="absolute" />}
      <Canvas
        key={attachment + "_LOD0.psk"}
        className="w-full aspect-[16/7] border border-neutral-500"
      >
        <Suspense fallback={"Loading"}>
          <ambientLight intensity={2} />
          <OrbitControls />
          <GunModel geometry={geometry}>
            {textures.map((material, i) => (
              <GunTexture
                key={i}
                attach={`material-${i}`}
                material={material}
              />
            ))}
          </GunModel>
        </Suspense>
      </Canvas>
    </>
  );
};
