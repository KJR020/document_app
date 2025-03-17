import { LuFile } from "react-icons/lu";

interface FileItemProps {
  name: string;
}

const FileItem: React.FC<FileItemProps> = ({ name }) => {
  return (
    <div className="ml-8 flex items-center py-1 hover:bg-surface-light">
      <LuFile size={16} className="flex-shrink-0 text-secondary" />
      <span className="ml-1 truncate text-neutral">{name}</span>
    </div>
  );
};

export default FileItem;
