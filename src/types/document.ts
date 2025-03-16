export interface DocumentUser {
  username: string;
  email: string;
}

export interface Directory {
  id: number;
  name: string;
}

export interface Document {
  id: number;
  createdAt: Date;
  createdBy: number;
  name: string;
  content: string;
  versionId: number | null;
  lastUpdatedAt: Date;
  user: DocumentUser;
  directory?: Directory;
}

export interface DocumentsResponse {
  documents: Document[];
}

export interface DocumentsErrorResponse {
  error: string;
}

export type DocumentsApiResponse = DocumentsResponse | DocumentsErrorResponse;

export interface UpdateDocumentPayload {
  name: string;
  content: string;
}

export interface DocumentVersion {
  id: number;
  name: string;
  content: string;
  createdAt: Date;
}

export interface DocumentChange {
  id: number;
  changeType: string;
  changedAt: Date;
  changedBy: DocumentUser;
  documentVersion?: DocumentVersion;
}

export interface DocumentHistory {
  versions: DocumentVersion[];
  changes: DocumentChange[];
}

export interface DocumentHistoryResponse {
  history: DocumentHistory;
}
