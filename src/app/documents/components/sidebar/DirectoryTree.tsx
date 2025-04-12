import FolderItem from "./FolderItem";
import { FileStructure } from "./types";

interface DirectoryTreeProps {
  fileStructure: FileStructure;
  selectedDirectoryId: number;
  onSelect: (directoryId: number) => void;
  onToggle: (path: string) => void;
  onMoveClick: (directoryId: number) => void;
}

const DirectoryTree: React.FC<DirectoryTreeProps> = ({
  fileStructure,
  selectedDirectoryId,
  onSelect,
  onToggle,
  onMoveClick,
}) => {
  if (Object.entries(fileStructure).length === 0) {
    return (
      <div className="px-2 py-4 text-neutral">フォルダが見つかりません</div>
    );
  }

  return (
    <div>
      {Object.entries(fileStructure).map(([name, item]) => (
        <FolderItem
          key={name}
          name={name}
          item={item}
          path=""
          directoryId={item.directoryId}
          selectedDirectoryId={selectedDirectoryId}
          onSelect={onSelect}
          onToggle={onToggle}
          onMoveClick={onMoveClick}
        />
      ))}
    </div>
  );
};

export default DirectoryTree;
