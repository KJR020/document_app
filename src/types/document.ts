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
