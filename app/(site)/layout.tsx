import { Navigation } from "@/features/site";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
};

export default Layout;
