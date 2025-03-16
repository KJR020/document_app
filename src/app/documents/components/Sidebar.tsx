import React, { useState, useEffect, useCallback } from "react";
import { CreateDirectoryDialog } from "./CreateDirectoryDialog";
import {
  LuChevronDown,
  LuChevronRight,
  LuFile,
  LuFolder,
} from "react-icons/lu";

interface FileStructureItem {
  type: "file" | "folder";
  expanded?: boolean;
  children?: Record<string, FileStructureItem>;
  directoryId: number;
}

interface RenderItemProps {
  name: string;
  item: FileStructureItem;
  path: string;
}

type FileStructure = Record<string, FileStructureItem>;

interface SidebarProps {
  onDirectorySelect: (directoryId: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onDirectorySelect }) => {
  const [fileStructure, setFileStructure] = useState<FileStructure>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedDirectoryId, setSelectedDirectoryId] = useState<number>(1);
  const [currentPath, setCurrentPath] = useState<string[]>([]);

  useEffect(() => {
    onDirectorySelect(1);
    fetchDirectoryStructure();
  }, []);

  async function fetchDirectoryStructure() {
    try {
      const response = await fetch("/api/directories");
      const data = await response.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      const transformToFileStructure = (node: any): FileStructureItem => {
        return {
          type: "folder",
          expanded: true,
          directoryId: node.id,
          children: {
            ...node.children.directories.reduce(
              (acc: Record<string, FileStructureItem>, dir: any) => ({
                ...acc,
                [dir.name]: transformToFileStructure(dir),
              }),
              {}
            ),
            ...node.children.documents.reduce(
              (acc: Record<string, FileStructureItem>, doc: any) => ({
                ...acc,
                [doc.name]: { type: "file" },
              }),
              {}
            ),
          },
        };
      };

      if (data.directory) {
        setFileStructure({
          [data.directory.name]: transformToFileStructure(data.directory),
        });
      }
    } catch (err) {
      setError("Failed to fetch directory structure");
      console.error("Error fetching directory structure:", err);
    } finally {
      setLoading(false);
    }
  }

  const toggleFolder = (path: string) => {
    const updateStructure = (
      obj: FileStructure,
      pathParts: string[]
    ): FileStructure => {
      const [current, ...rest] = pathParts;

      if (rest.length === 0) {
        return {
          ...obj,
          [current]: {
            ...obj[current],
            expanded: !obj[current].expanded,
          },
        };
      }

      return {
        ...obj,
        [current]: {
          ...obj[current],
          children: obj[current].children
            ? updateStructure(obj[current].children, rest)
            : {},
        },
      };
    };

    const pathParts = path.split("/").filter(Boolean);
    setFileStructure(updateStructure(fileStructure, pathParts));
  };

  const RenderItem: React.FC<RenderItemProps & { directoryId: number }> = ({
    name,
    item,
    path,
    directoryId,
  }) => {
    const fullPath = path ? `${path}/${name}` : name;

    if (item.type === "folder") {
      return (
        <div>
          <div
            className={`flex cursor-pointer items-center py-1 hover:bg-surface-light ${
              selectedDirectoryId === directoryId ? "bg-surface-light" : ""
            }`}
            onClick={() => {
              toggleFolder(fullPath);
              setSelectedDirectoryId(directoryId);
              onDirectorySelect(directoryId);
            }}
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
          </div>

          {item.expanded && (
            <div className="ml-6">
              {Object.entries(item.children || {}).map(
                ([childName, childItem]) => (
                  <RenderItem
                    key={childName}
                    name={childName}
                    item={childItem}
                    path={fullPath}
                    directoryId={childItem.directoryId}
                  />
                )
              )}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="ml-8 flex items-center py-1 hover:bg-surface-light">
        <LuFile size={16} className="flex-shrink-0 text-secondary" />
        <span className="ml-1 truncate text-neutral">{name}</span>
      </div>
    );
  };

  const createDirectory = useCallback(async (name: string) => {
    try {
      const parentId = 1; // TODO: Use actual current directory ID
      const response = await fetch("/api/directories/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, parentId }),
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error);
        return;
      }

      // Refresh the directory structure
      fetchDirectoryStructure();
    } catch (err) {
      setError("Failed to create directory");
      console.error("Error creating directory:", err);
    }
  }, []);

  const addNewFolder = () => {
    setIsCreateDialogOpen(true);
  };

  return (
    <div className="h-full w-full border-r bg-surface p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral">Directories</h2>
        <div className="flex space-x-2">
          <button
            onClick={addNewFolder}
            className="rounded p-1 hover:bg-surface-light"
            title="新規フォルダ"
          >
            <LuFolder size={16} className="text-primary" />
          </button>
        </div>
      </div>

      <div className="overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <span className="loading loading-spinner loading-sm"></span>
          </div>
        ) : error ? (
          <div className="px-2 py-4 text-error">{error}</div>
        ) : Object.entries(fileStructure).length === 0 ? (
          <div className="px-2 py-4 text-neutral">フォルダが見つかりません</div>
        ) : (
          Object.entries(fileStructure).map(([name, item]) => (
            <RenderItem
              key={name}
              name={name}
              item={item}
              path=""
              directoryId={item.directoryId}
            />
          ))
        )}
      </div>

      <CreateDirectoryDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={createDirectory}
      />
    </div>
  );
};

export default Sidebar;
