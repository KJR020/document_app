"use client";

import React from "react";
import Link from "next/link";
import { IconBase } from "react-icons";

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "Document App" }) => {
  return (
    <header className="border-b bg-base-100 border-base-400 sticky top-0 z-10 shadow-sm">
      <div className="mx-auto max-w-7xl py-2 flex justify-between items-center ">
        <Link href="/">
          <h1 className="text-2xl font-bold tracking-tight text-primary cursor-pointer">
            {title}
          </h1>
        </Link>
        <nav className="flex space-x-4">
          <Link
            href="/documents"
            className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >
            Documents
          </Link>
          <search>
            <input
              type="text"
              placeholder="Search..."
              className="border border-gray-300 rounded-md p-1"
            />
          </search>
        </nav>
      </div>
    </header>
  );
};

export default Header;
