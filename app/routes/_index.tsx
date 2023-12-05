import { SkinCanvas } from "~/components/SkinCanvas";

export default function Index() {
  return (
    <div className="flex flex-col mx-auto h-[calc(100vh-3.5rem)]">
      <h1 className="text-5xl text-center py-12">VALORANT 3D Skin Viewer</h1>
      <div className="mx-auto h-[75%] w-full">
        <SkinCanvas attachment="GN_Boltsniper_Dragon_Lv1_Skelmesh" />
      </div>
    </div>
  );
}

export const ErrorBoundary = () => {
  return (
    <div className="flex flex-col mx-auto h-[calc(100vh-3.5rem)]">
      <h1 className="text-5xl text-center py-12">VALORANT 3D Skin Viewer</h1>
    </div>
  );
};
