import Navbar from "./Navbar/Navbar";
import React from "react";

const Layout = ({ children }) => {
  return (
    <main className="h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white">
      <header className="h-fit">
        <Navbar />
      </header>
      <article className="flex flex-col">{children}</article>
    </main>
  );
};

export default Layout;
