import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Document Management System</h1>
      <div className="max-w-2xl text-center">
        <p className="text-xl mb-8">
          Store, organize, and manage your documents efficiently.
        </p>
        <Link
          href="/documents"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          View Documents
        </Link>
      </div>
    </main>
  );
}
