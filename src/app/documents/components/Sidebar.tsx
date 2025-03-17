import React, { useState, useEffect, useCallback } from "react";
import { CreateDirectoryDialog } from "./CreateDirectoryDialog";
import { MoveDirectoryDialog } from "./MoveDirectoryDialog";
import type {
  FileStructure,
  DirectoryInfo,
  FileStructureItem,
} from "./sidebar/types";
import DirectoryTree from "./sidebar/DirectoryTree";
import SidebarHeader from "./sidebar/SidebarHeader";

interface SidebarProps {
  onDirectorySelect: (directoryId: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onDirectorySelect }) => {
  const [fileStructure, setFileStructure] = useState<FileStructure>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const [selectedDirectoryId, setSelectedDirectoryId] = useState<number>(1);
  const [directories, setDirectories] = useState<DirectoryInfo[]>([]);
  const [directoryToMove, setDirectoryToMove] = useState<number | null>(null);

  useEffect(() => {
    onDirectorySelect(1);
    fetchDirectoryStructure();
  }, []);

  const getDirectoryPath = (
    name: string,
    item: FileStructureItem,
    parentPath = ""
  ): string => {
    const fullPath = parentPath ? `${parentPath}/${name}` : name;
    return fullPath;
  };

  const collectDirectoryPaths = (
    structure: FileStructure,
    parentPath = "",
    paths: DirectoryInfo[] = []
  ): DirectoryInfo[] => {
    Object.entries(structure).forEach(([name, item]) => {
      if (item.type === "folder") {
        const fullPath = getDirectoryPath(name, item, parentPath);
        if (item.directoryId !== directoryToMove) {
          paths.push({ id: item.directoryId, name, path: fullPath });
        }
        if (item.children) {
          collectDirectoryPaths(item.children, fullPath, paths);
        }
      }
    });
    return paths;
  };

  const transformToFileStructure = (node: {
    id: number;
    children: {
      directories: any[];
      documents: any[];
    };
  }): FileStructureItem => {
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
          (
            acc: Record<string, FileStructureItem>,
            doc: {
              id: number;
              name: string;
            }
          ) => ({
            ...acc,
            [doc.name]: { type: "file", directoryId: doc.id },
          }),
          {}
        ),
      },
    };
  };

  async function fetchDirectoryStructure() {
    try {
      const response = await fetch("/api/directories");
      const data = await response.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      if (data.directory) {
        const structure = {
          [data.directory.name]: transformToFileStructure(data.directory),
        };
        setFileStructure(structure);

        const paths = [...collectDirectoryPaths(structure)];
        setDirectories(paths);
      }
    } catch (err) {
      setError("Failed to fetch directory structure");
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

  const createDirectory = useCallback(
    async (name: string) => {
      try {
        const response = await fetch("/api/directories/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, parentId: selectedDirectoryId }),
        });

        const data = await response.json();
        if (data.error) {
          setError(data.error);
          return;
        }

        fetchDirectoryStructure();
      } catch (err) {
        setError("Failed to create directory");
        console.error("Error creating directory:", err);
      }
    },
    [selectedDirectoryId]
  );

  const moveDirectory = useCallback(
    async (toDirectoryId: number) => {
      if (!directoryToMove) return;

      try {
        const response = await fetch(`/api/directories/${directoryToMove}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ toDirectoryId }),
        });

        const data = await response.json();
        if (data.error) {
          setError(data.error);
          return;
        }

        await fetchDirectoryStructure();
        setIsMoveDialogOpen(false);
        setDirectoryToMove(null);
      } catch (err) {
        setError("Failed to move directory");
        console.error("Error moving directory:", err);
      }
    },
    [directoryToMove]
  );

  const handleSelect = (directoryId: number) => {
    setSelectedDirectoryId(directoryId);
    onDirectorySelect(directoryId);
  };

  const handleMoveClick = (directoryId: number) => {
    setDirectoryToMove(directoryId);
    const paths = collectDirectoryPaths(fileStructure);
    setDirectories([
      {
        id: 1,
        name: Object.keys(fileStructure)[0],
        path: Object.keys(fileStructure)[0],
      },
      ...paths,
    ]);
    setIsMoveDialogOpen(true);
  };

  return (
    <div className="h-full w-full border-r bg-surface p-4">
      <SidebarHeader onAddFolder={() => setIsCreateDialogOpen(true)} />

      <div className="overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <span className="loading loading-spinner loading-sm"></span>
          </div>
        ) : error ? (
          <div className="px-2 py-4 text-error">{error}</div>
        ) : (
          <DirectoryTree
            fileStructure={fileStructure}
            selectedDirectoryId={selectedDirectoryId}
            onSelect={handleSelect}
            onToggle={toggleFolder}
            onMoveClick={handleMoveClick}
          />
        )}
      </div>

      <CreateDirectoryDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={createDirectory}
      />
      <MoveDirectoryDialog
        isOpen={isMoveDialogOpen}
        onClose={() => setIsMoveDialogOpen(false)}
        onMove={moveDirectory}
        directories={directories}
        currentDirectoryId={directoryToMove || 0}
      />
    </div>
  );
};

export default Sidebar;
