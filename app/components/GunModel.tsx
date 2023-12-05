import type { PropsWithChildren } from "react";
import type { BufferGeometry } from "three";

export const GunModel = ({
  children,
  geometry,
}: PropsWithChildren<{ geometry: BufferGeometry }>) => {
  return (
    <group>
      <mesh geometry={geometry} scale={0.3}>
        {children}
      </mesh>
    </group>
  );
};
