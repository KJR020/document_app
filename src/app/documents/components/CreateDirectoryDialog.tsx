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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 p-6 rounded-lg shadow-xl w-96">
        <h3 className="text-lg font-semibold mb-4 text-neutral">
          新規フォルダ
        </h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={directoryName}
            onChange={(e) => setDirectoryName(e.target.value)}
            placeholder="フォルダ名"
            className="w-full p-2 border rounded mb-4 bg-surface focus:outline-none focus:ring-2 focus:ring-primary text-neutral"
            autoFocus
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 hover:bg-surface-light rounded btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!directoryName.trim()}
              className="px-4 py-2 btn btn-primary  rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
