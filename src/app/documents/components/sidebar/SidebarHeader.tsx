import { LuFolder } from "react-icons/lu";

interface SidebarHeaderProps {
  onAddFolder: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ onAddFolder }) => {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-neutral">Directories</h2>
      <div className="flex space-x-2">
        <button
          onClick={onAddFolder}
          className="rounded p-1 hover:bg-surface-light"
          title="新規フォルダ"
        >
          <LuFolder size={16} className="text-primary" />
        </button>
      </div>
    </div>
  );
};

export default SidebarHeader;
