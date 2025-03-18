"use client";

import React from "react";
import Link from "next/link";
import { IconBase } from "react-icons";
import { ThemeToggle } from "@/components/ThemeToggle";

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "Document App" }) => {
  return (
    <header className="border-base-400 sticky top-0 z-10 border-b bg-base-100 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
        <Link href="/">
          <h1 className="cursor-pointer text-2xl font-bold tracking-tight text-primary">
            {title}
          </h1>
        </Link>
        <nav className="flex items-center space-x-4">
          <Link
            href="/documents"
            className="rounded-md px-3 py-2 text-sm font-medium text-base-content hover:text-primary"
          >
            Documents
          </Link>
          <search>
            <input
              type="text"
              placeholder="Search..."
              className="rounded-md border border-base-300 bg-base-100 p-1 text-base-content"
            />
          </search>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};

export default Header;
