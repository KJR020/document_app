import { dir } from "console";
import React, { useState } from "react";

interface MoveDirectoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onMove: (targetDirectoryId: number) => Promise<void>;
  directories: { id: number; name: string; path: string }[];
  currentDirectoryId: number;
  descendantIds: number[];
}

export const MoveDirectoryDialog: React.FC<MoveDirectoryDialogProps> = ({
  isOpen,
  onClose,
  onMove,
  directories,
  currentDirectoryId,
  descendantIds,
}) => {
  const [selectedDirectoryId, setSelectedDirectoryId] = useState<number | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleMove = async () => {
    if (!selectedDirectoryId) {
      setError("移動先のディレクトリを選択してください");
      return;
    }

    // Prevent moving to root directory
    if (selectedDirectoryId === 1) {
      setError("ルートディレクトリには移動できません");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onMove(selectedDirectoryId);
      onClose();
    } catch (err) {
      setError("ディレクトリの移動に失敗しました");
      console.error("Error moving directory:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 rounded-lg bg-base-200 p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-semibold text-neutral">
          ディレクトリを移動
        </h3>
        <div className="mb-4">
          <label className="mb-2 block text-sm text-neutral">移動先:</label>
          <select
            value={selectedDirectoryId || ""}
            onChange={(e) => setSelectedDirectoryId(Number(e.target.value))}
            className="w-full rounded border border-surface-dark bg-surface p-2 text-neutral"
          >
            <option value="">選択してください</option>
            {directories
              .filter(
                (dir) =>
                  dir.id !== currentDirectoryId &&
                  !descendantIds.includes(dir.id) &&
                  dir.id !== 1 // Exclude root directory
              )
              .map((dir) => (
                <option key={dir.id} value={dir.id}>
                  {dir.path}
                </option>
              ))}
          </select>
        </div>
        {error && <div className="mb-4 text-sm text-error">{error}</div>}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="hover:bg-surface-dark/80 rounded bg-surface-dark px-4 py-2 text-neutral"
          >
            キャンセル
          </button>
          <button
            onClick={handleMove}
            disabled={loading || !selectedDirectoryId}
            className={`hover:bg-primary/80 rounded bg-primary px-4 py-2 text-neutral-content ${
              loading || !selectedDirectoryId ? "opacity-50" : ""
            }`}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "移動"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
