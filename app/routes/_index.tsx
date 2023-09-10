import { Search } from "~/features/skin/Search";

export default function Index() {
  return (
    <>
      <div className="flex flex-col mx-auto">
        <h1 className="text-white text-5xl text-center py-12">
          VALORANT 3D Skin Viewer
        </h1>
        <div className="mx-auto">
          <Search />
        </div>
      </div>
    </>
  );
}
