import { redirect } from "@remix-run/node";

export const loader = () => {
  return redirect("./3d");
};
