import { OrbitControls, useTexture } from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import { useRouteLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { Color, RepeatWrapping } from "three";
import { PSKLoader } from "~/pskLoader";
import { type loader as skinLoader } from "~/routes/view.$name";

export default function View3D() {
  const skin = useRouteLoaderData<typeof skinLoader>("routes/view.$name");
  if (!skin) {
    return <p>Uh oh!</p>;
  }

  return (
    <>
      <p className="absolute left-5 bottom-5 text-xl text-white">
        {skin.skins.name}
      </p>
      <Canvas className="w-full aspect-[16/7] border border-neutral-500">
        <Suspense fallback={"Loading"}>
          <ambientLight intensity={2} />
          <OrbitControls />
          <Gun model={skin.skinlevels.attachment + "_LOD0.psk"} />
        </Suspense>
      </Canvas>
    </>
  );
}

type GunProps = {
  model: string;
};

function Gun(props: GunProps) {
  const { geometry, skeleton, textures } = useLoader(
    PSKLoader,
    props.model,
    (loader) => {
      loader.setResourcePath("https://valorantskins.turker.dev");
    }
  );

  return (
    <group>
      <mesh geometry={geometry} scale={0.3}>
        {textures.map((material, i) => (
          <GunTexture key={i} attach={`material-${i}`} material={material} />
        ))}
      </mesh>
    </group>
  );
}

function GunTexture({ attach, material }: any) {
  const textures = useTexture(
    Object.keys(material.Textures).reduce((acc, key) => {
      if (
        key === "HDRI" ||
        key === "Ares_HDRI_FirstPerson" ||
        key === "Ares_HDRI_FirstPersonGlass"
      ) {
        return acc;
      }

      acc[key] = "https://valorantskins.turker.dev/" + material.Textures[key];
      return acc;
    }, {})
  );

  const mapProps = {
    map: textures.Albedo,
    "map-wrapT": textures.Albedo ? RepeatWrapping : undefined,
    "map-wrapS": textures.Albedo ? RepeatWrapping : undefined,
  };

  return (
    <meshStandardMaterial
      attach={attach}
      {...mapProps}
      normalMap={textures.Normal}
      emissiveMap={textures.AEM}
      emissive={
        material.Parameters.Colors["Emissive Color"]
          ? new Color(
              material.Parameters.Colors["Emissive Color"].R,
              material.Parameters.Colors["Emissive Color"].G,
              material.Parameters.Colors["Emissive Color"].B
            )
          : undefined
      }
      emissiveIntensity={material.Parameters.Scalars["Emissive Intensity"]}
      side={2}
    />
  );
}

export function ErrorBoundary() {
  return <h1>Error while loading the skin</h1>;
}
