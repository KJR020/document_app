import { format } from "date-fns";

import { DocumentHistory } from "@/types/document";

interface DocumentHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  history: DocumentHistory;
}

export function DocumentHistoryDialog({
  isOpen,
  onClose,
  history,
}: DocumentHistoryDialogProps) {
  return (
    <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box max-w-3xl bg-base-200">
        <h3 className="mb-4 text-lg font-bold text-neutral">
          Document History
        </h3>

        <div className="space-y-6">
          <div>
            <h4 className="text-md mb-2 font-semibold">Versions</h4>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Version</th>
                    <th>Name</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {history.versions.map((version) => (
                    <tr key={version.id}>
                      <td>V{version.id}</td>
                      <td>{version.name}</td>
                      <td>
                        {format(
                          new Date(version.createdAt),
                          "yyyy/MM/dd HH:mm"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8">
            <h4 className="text-md mb-4 font-semibold">Change History</h4>
            <ul className="timeline timeline-vertical">
              {history.changes.map((change, index) => (
                <li key={change.id}>
                  {index > 0 && <hr />}
                  <div className="timeline-middle">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="timeline-box timeline-end">
                    <div className="font-semibold capitalize">
                      {change.changeType.toLowerCase()}
                      {change.documentVersion &&
                        ` - V${change.documentVersion.id}`}
                    </div>
                    <div className="text-sm text-secondary">
                      {change.changedBy.username} •{" "}
                      {format(new Date(change.changedAt), "yyyy/MM/dd HH:mm")}
                    </div>
                    {change.documentVersion && (
                      <div className="mt-2 text-sm">
                        <div className="font-medium">
                          Title: {change.documentVersion.name}
                        </div>
                      </div>
                    )}
                  </div>
                  {index < history.changes.length - 1 && <hr />}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
      <div className="bg-neutral/50 modal-backdrop" onClick={onClose} />
    </dialog>
  );
}
