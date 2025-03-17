export interface DirectoryInfo {
  id: number;
  name: string;
  path: string;
}

export interface FileStructureItem {
  type: "file" | "folder";
  expanded?: boolean;
  children?: Record<string, FileStructureItem>;
  directoryId: number;
}

export type FileStructure = Record<string, FileStructureItem>;
