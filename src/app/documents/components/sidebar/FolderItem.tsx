import {
  LuChevronDown,
  LuChevronRight,
  LuFolder,
  LuMove,
} from "react-icons/lu";
import FileItem from "./FileItem";
import { FileStructureItem } from "./types";

interface FolderItemProps {
  name: string;
  item: FileStructureItem;
  path: string;
  directoryId: number;
  selectedDirectoryId: number;
  onSelect: (directoryId: number) => void;
  onToggle: (path: string) => void;
  onMoveClick: (directoryId: number) => void;
}

const FolderItem: React.FC<FolderItemProps> = ({
  name,
  item,
  path,
  directoryId,
  selectedDirectoryId,
  onSelect,
  onToggle,
  onMoveClick,
}) => {
  const fullPath = path ? `${path}/${name}` : name;

  const handleClick = () => {
    onToggle(fullPath);
    onSelect(directoryId);
  };

  return (
    <div>
      <div
        className={`flex cursor-pointer items-center py-1 hover:bg-surface-light ${
          selectedDirectoryId === directoryId ? "bg-surface-light" : ""
        }`}
        onClick={handleClick}
      >
        <span className="ml-2 mr-1 flex-shrink-0">
          {item.expanded ? (
            <LuChevronDown size={16} className="text-secondary" />
          ) : (
            <LuChevronRight size={16} className="text-secondary" />
          )}
        </span>
        <LuFolder size={16} className="flex-shrink-0 text-primary" />
        <span className="ml-1 min-w-0 flex-1 truncate text-neutral">
          {name}
        </span>
        {directoryId !== 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveClick(directoryId);
            }}
            className="mr-2 rounded p-1 hover:bg-surface-dark"
            title="移動"
          >
            <LuMove size={16} className="text-primary" />
          </button>
        )}
      </div>

      {item.expanded && item.children && (
        <div className="ml-6">
          {Object.entries(item.children).map(([childName, childItem]) =>
            childItem.type === "folder" ? (
              <FolderItem
                key={childName}
                name={childName}
                item={childItem as FileStructureItem}
                path={fullPath}
                directoryId={childItem.directoryId}
                selectedDirectoryId={selectedDirectoryId}
                onSelect={onSelect}
                onToggle={onToggle}
                onMoveClick={onMoveClick}
              />
            ) : (
              <FileItem key={childName} name={childName} />
            )
          )}
        </div>
      )}
    </div>
  );
};

export default FolderItem;
