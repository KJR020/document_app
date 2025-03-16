"use client";

import { useEffect, useState } from "react";
import { CreateDocumentForm } from "@/app/documents/components/CreateDocumentForm";
import { Document } from "@/types/document";
import { DocumentCard } from "@/app/documents/components/DocumentCard";
import Sidebar from "./components/Sidebar";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDirectoryId, setSelectedDirectoryId] = useState<number>(1);

  const [selectedDirectoryName, setSelectedDirectoryName] =
    useState<string>("Documents");

  useEffect(() => {
    fetchDocuments(selectedDirectoryId);
    if (selectedDirectoryId) {
      fetchDirectoryInfo(selectedDirectoryId);
    } else {
      setSelectedDirectoryName("Documents");
    }
  }, [selectedDirectoryId]);

  async function fetchDirectoryInfo(directoryId: number) {
    try {
      console.log("fetching directory info");
      const response = await fetch(`/api/directories/${directoryId}`);
      const data = await response.json();
      if (data.directory) {
        setSelectedDirectoryName(data.directory.name);
      }
    } catch (err) {
      console.error("Error fetching directory info:", err);
    }
  }

  async function fetchDocuments(directoryId: number | null) {
    try {
      const url = directoryId
        ? `/api/documents?directoryId=${directoryId}`
        : "/api/documents";
      const response = await fetch(url);
      const data = await response.json();
      if ("documents" in data) {
        setDocuments(data.documents);
      } else if ("error" in data) {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to fetch documents");
      console.error("Error fetching documents:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error p-4">
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <PanelGroup direction="horizontal">
        <Panel defaultSize={20} minSize={15} maxSize={40}>
          <div className="h-full overflow-auto">
            <Sidebar onDirectorySelect={setSelectedDirectoryId} />
          </div>
        </Panel>
        <PanelResizeHandle className="w-1 bg-gray-200 transition-colors hover:w-1 hover:bg-gray-400" />
        <Panel>
          <div className="h-full overflow-auto p-4">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-primary"></h1>
              {selectedDirectoryId}
              <CreateDocumentForm
                selectedDirectoryId={selectedDirectoryId}
                onDocumentCreate={() => fetchDocuments(selectedDirectoryId)}
              />
            </div>
            <div className="grid grid-cols-3 gap-6 px-4 md:grid-cols-2 xl:grid-cols-3">
              {documents.map((doc) => (
                <DocumentCard key={doc.id} document={doc} />
              ))}
              {documents.length === 0 && (
                <div className="text-base-content/70 col-span-full py-8 text-center">
                  No documents found. Create your first document!
                </div>
              )}
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
