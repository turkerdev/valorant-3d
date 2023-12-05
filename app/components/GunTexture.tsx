import { useTexture } from "@react-three/drei";
import { Color, RepeatWrapping } from "three";

export const GunTexture = ({ attach, material }: any) => {
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
};
