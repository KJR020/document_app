"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const initApp = async () => {
      try {
        const response = await fetch("/api/init");
        const data = await response.json();
        if (data.error) {
          console.error("Initialization failed:", data.error);
          return;
        }
        console.log("App initialized successfully", data);
      } catch (error) {
        console.error("Failed to initialize app:", error);
      }
    };

    initApp();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="mb-8 text-4xl font-bold">Document Management System</h1>
      <div className="max-w-2xl text-center">
        <p className="mb-8 text-xl">
          Store, organize, and manage your documents efficiently.
        </p>
        <Link
          href="/documents"
          className="btn btn-primary px-6 py-3 transition-colors"
        >
          View Documents
        </Link>
      </div>
    </main>
  );
}
