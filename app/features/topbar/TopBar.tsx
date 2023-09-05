import React from "react";

type Props = React.PropsWithChildren<{}>;

export function TopBar({ children }: Props) {
  return <nav className="flex p-1 items-center gap-2">{children}</nav>;
}
