import { redirect } from "@remix-run/cloudflare";

export const loader = () => {
  return redirect("./3d");
};
