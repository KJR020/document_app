"use client";

import { useEffect, useState } from "react";
import CreateDocumentForm from "@/app/documents/components/CreateDocumentForm";

interface Document {
  id: string;
  name: string;
  content: string;
  createdAt: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  async function fetchDocuments() {
    try {
      const response = await fetch("/api/documents");
      const data = await response.json();
      console.log(data);
      setDocuments(data);
    } catch (err) {
      setError("Failed to fetch documents");
      console.error("Error fetching documents:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Documents</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {showCreateForm ? "Cancel" : "Create New Document"}
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-8">
          <CreateDocumentForm
            onDocumentCreated={() => {
              fetchDocuments();
              setShowCreateForm(false);
            }}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold">{doc.name}</h2>
            {}
          </div>
        ))}
      </div>
    </div>
  );
}
