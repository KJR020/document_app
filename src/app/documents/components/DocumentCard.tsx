import {
  Document,
  DocumentHistory,
  UpdateDocumentPayload,
} from "@/types/document";
import { format } from "date-fns";
import { useState } from "react";
import { DocumentHistoryDialog } from "./DocumentHistoryDialog";
import { useRouter } from "next/navigation";

interface DocumentCardProps {
  document: Document;
}

export function DocumentCard({ document }: DocumentCardProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isViewingHistory, setIsViewingHistory] = useState(false);
  const [history, setHistory] = useState<DocumentHistory | null>(null);
  const [editForm, setEditForm] = useState<UpdateDocumentPayload>({
    name: document.name,
    content: document.content,
  });

  const handleViewHistory = async () => {
    try {
      const response = await fetch(`/api/documents/${document.id}/history`);
      if (!response.ok) {
        throw new Error("Failed to fetch document history");
      }
      const data = await response.json();
      setHistory(data.history);
      setIsViewingHistory(true);
    } catch (error) {
      console.error("Error fetching document history:", error);
      alert("Failed to fetch document history");
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/documents/${document.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        throw new Error("Failed to update document");
      }

      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating document:", error);
      alert("Failed to update document");
    }
  };

  return (
    <>
      <div className="card border border-base-200 bg-base-100 shadow-md transition-all duration-200 hover:shadow-lg">
        <figure className="bg-base-300 px-4 pt-4">
          <div className="flex h-32 w-full items-center justify-center rounded-lg bg-surface-light">
            <img
              src="/file.svg"
              alt="Document icon"
              className="h-12 w-12 opacity-50"
            />
          </div>
        </figure>
        <div className="card-body">
          <h2 className="card-title truncate text-lg font-semibold text-neutral">
            {document.name}
          </h2>
          <p className="line-clamp-2 text-sm text-secondary">
            {document.content}
          </p>
          <div className="mt-2 flex items-center gap-2 text-xs text-secondary">
            <span>{format(new Date(document.createdAt), "yyyy/MM/dd")}</span>
            <span>•</span>
            <span>{document.user.username}</span>
          </div>
          <div className="card-actions mt-4 justify-end">
            <button
              className="btn btn-ghost btn-sm"
              onClick={handleViewHistory}
            >
              View History
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          </div>
        </div>
      </div>

      {/* History Modal */}
      {history && (
        <DocumentHistoryDialog
          isOpen={isViewingHistory}
          onClose={() => setIsViewingHistory(false)}
          history={history}
        />
      )}

      {/* Edit Modal */}
      <dialog className={`modal ${isEditing ? "modal-open" : ""}`}>
        <div className="modal-box bg-base-200">
          <h3 className="mb-4 text-lg font-bold text-neutral">Edit Document</h3>
          <form onSubmit={handleEdit}>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Title</legend>
              <input
                type="text"
                className="input w-full border-4 border-gray-500"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                required
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Content</legend>
              <textarea
                className="textarea h-80 w-full border-4 border-gray-500"
                value={editForm.content}
                onChange={(e) =>
                  setEditForm({ ...editForm, content: e.target.value })
                }
                required
              />
            </fieldset>
            <div className="modal-action">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </div>
          </form>
        </div>
        <div
          className="bg-neutral/50 modal-backdrop"
          onClick={() => setIsEditing(false)}
        />
      </dialog>
    </>
  );
}
