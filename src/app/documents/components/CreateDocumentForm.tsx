import { useState } from "react";
import { useRouter } from "next/navigation";
import { on } from "events";

interface CreateDocumentFormProps {
  selectedDirectoryId: number | null;
  onDocumentCreate: () => void;
}

export function CreateDocumentForm({
  selectedDirectoryId,
  onDocumentCreate,
}: CreateDocumentFormProps) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState({
    name: "",
    content: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          directoryId: selectedDirectoryId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create document");
      }

      setForm({ name: "", content: "" });
      setIsCreating(false);
      router.refresh();

      onDocumentCreate();
    } catch (error) {
      alert("Failed to create document");
    }
  };

  return (
    <>
      <button className="btn btn-primary" onClick={() => setIsCreating(true)}>
        Create Document
      </button>

      <dialog className={`modal ${isCreating ? "modal-open" : ""}`}>
        <div className="modal-box bg-base-100">
          <h3 className="mb-4 text-lg font-bold text-neutral">
            Create Document
          </h3>
          {selectedDirectoryId}
          <form onSubmit={handleSubmit}>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Title</legend>
              <input
                type="text"
                className="input w-full border-4 border-gray-500"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Content</legend>
              <textarea
                className="textarea h-80 w-full border-4 border-gray-500"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                required
              />
            </fieldset>
            <div className="modal-action">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setIsCreating(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create
              </button>
            </div>
          </form>
        </div>
        <div
          className="bg-neutral/50 modal-backdrop"
          onClick={() => setIsCreating(false)}
        />
      </dialog>
    </>
  );
}
