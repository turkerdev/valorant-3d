import { OrbitControls, useTexture } from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { eq, sql } from "drizzle-orm";
import { Suspense } from "react";
import { Color, RepeatWrapping } from "three";
import { db } from "~/db/db.server";
import { skinlevels, skins } from "~/db/schema.server";
import { Search } from "~/features/search/Input";
import { PSKLoader } from "~/pskLoader";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");

  const specific = (text: string) => {
    const [skin] = db
      .select()
      .from(skins)
      .where(eq(skins.name, text))
      .innerJoin(skinlevels, eq(skins.id, skinlevels.skin))
      .limit(1)
      .all();

    return skin;
  };

  const random = () => {
    const [skin] = db
      .select()
      .from(skins)
      .innerJoin(skinlevels, eq(skins.id, skinlevels.skin))
      .limit(1)
      .orderBy(sql`random()`)
      .all();

    return skin;
  };

  if (!q) {
    return random();
  }

  const skin = specific(q);
  if (!skin) {
    return random();
  }
  return skin;
};

export default function Index() {
  const skin = useLoaderData<typeof loader>();

  return (
    <div>
      <Search />
      <p key={skin.skins.id}>{skin.skins.name}</p>
      <Canvas style={{ height: "100vh", width: "100vw" }}>
        <Suspense fallback={null}>
          <Gun model={skin.skinlevels.attachment + "_LOD0.psk"} />
          <ambientLight intensity={2} />
          <OrbitControls />
        </Suspense>
      </Canvas>
    </div>
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
      loader.setResourcePath(
        "https://pub-ee66ec58f4e14d87aaaba2b80a82c852.r2.dev"
      );
    }
  );

  return (
    <>
      <group>
        <mesh geometry={geometry} scale={0.3}>
          {textures.map((material, i) => (
            <GunTexture key={i} attach={`material-${i}`} material={material} />
          ))}
        </mesh>
      </group>
    </>
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

      acc[key] =
        "https://pub-ee66ec58f4e14d87aaaba2b80a82c852.r2.dev/" +
        material.Textures[key];
      return acc;
    }, {})
  );

  return (
    <>
      <meshStandardMaterial
        attach={attach}
        map={textures.Albedo}
        map-wrapT={textures.Albedo ? RepeatWrapping : undefined}
        map-wrapS={textures.Albedo ? RepeatWrapping : undefined}
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
    </>
  );
}
