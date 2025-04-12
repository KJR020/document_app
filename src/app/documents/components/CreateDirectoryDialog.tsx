import { useState } from "react";

interface CreateDirectoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

export const CreateDirectoryDialog = ({
  isOpen,
  onClose,
  onSubmit,
}: CreateDirectoryDialogProps) => {
  const [directoryName, setDirectoryName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (directoryName.trim()) {
      onSubmit(directoryName.trim());
      setDirectoryName("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 rounded-lg bg-base-100 p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-semibold text-neutral">
          新規フォルダ
        </h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={directoryName}
            onChange={(e) => setDirectoryName(e.target.value)}
            placeholder="フォルダ名"
            className="mb-4 w-full rounded border bg-surface p-2 text-neutral focus:outline-none focus:ring-2 focus:ring-primary"
            autoFocus
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="btn rounded px-4 py-2 hover:bg-surface-light"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!directoryName.trim()}
              className="hover:bg-primary/90 btn btn-primary rounded px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
