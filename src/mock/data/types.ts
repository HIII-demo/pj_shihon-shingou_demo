// ============================================================
// 全エンティティの型定義
// ============================================================

export type ProjectStatus =
  | "draft"
  | "uploading"
  | "analyzing"
  | "extracted"
  | "generating"
  | "review"
  | "approved"
  | "archived";

export type FileType = "drawing" | "specification" | "reference";
export type FileFormat = "pdf" | "png" | "jpg" | "dxf" | "xlsx" | "docx";

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  clientName: string;
  projectCode: string;
  createdAt: string;
  updatedAt: string;
  assignee: string;
  fileCount: number;
  extractedElementCount: number;
}

export interface ProjectFile {
  id: string;
  projectId: string;
  name: string;
  type: FileType;
  format: FileFormat;
  size: number; // bytes
  version: number;
  uploadedAt: string;
  uploadedBy: string;
  thumbnailUrl?: string;
}

export interface ExtractionElement {
  id: string;
  projectId: string;
  fileId: string;
  category: "dimension" | "material" | "annotation" | "part" | "tolerance" | "surface";
  key: string;
  value: string;
  unit: string;
  confidence: number; // 0-1
  sourceFileId: string;
  bbox: { x: number; y: number; w: number; h: number };
  pageNumber: number;
  verified: boolean;
}

export interface SimilarDrawing {
  id: string;
  projectId: string;
  similarProjectId: string;
  similarProjectName: string;
  similarFileName: string;
  score: number;
  reason: string;
}

export interface SimilarSpec {
  id: string;
  projectId: string;
  specTitle: string;
  specCode: string;
  score: number;
  reason: string;
  sections: string[];
}

export interface DraftSection {
  id: string;
  draftId: string;
  sectionNumber: string;
  title: string;
  content: string;
  sourceElements: string[]; // element IDs
  status: "auto" | "edited" | "approved";
}

export interface SpecDraft {
  id: string;
  projectId: string;
  templateId: string;
  templateName: string;
  version: number;
  status: "generating" | "draft" | "review" | "approved";
  createdAt: string;
  updatedAt: string;
  sections: DraftSection[];
}

export interface ReviewItem {
  id: string;
  projectId: string;
  draftId: string;
  sectionId: string;
  type: "missing" | "inconsistency" | "warning" | "suggestion";
  severity: "high" | "medium" | "low";
  title: string;
  description: string;
  status: "open" | "resolved" | "dismissed";
  assignee?: string;
}

export interface ReviewComment {
  id: string;
  reviewItemId: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  projectId: string;
  action: string;
  detail: string;
  user: string;
  timestamp: string;
  category: "file" | "analysis" | "draft" | "review" | "system";
}

export interface Template {
  id: string;
  name: string;
  description: string;
  sections: string[];
  isDefault: boolean;
}

export interface RequiredCheckItem {
  id: string;
  category: string;
  label: string;
  enabled: boolean;
  severity: "high" | "medium" | "low";
}

export interface VersionDiff {
  id: string;
  projectId: string;
  fileIdA: string;
  fileIdB: string;
  fileNameA: string;
  fileNameB: string;
  versionA: number;
  versionB: number;
  changes: DiffChange[];
}

export interface DiffChange {
  id: string;
  type: "dimension" | "annotation" | "material" | "tolerance" | "added" | "removed";
  location: string;
  oldValue: string;
  newValue: string;
  impactSections: string[];
  severity: "high" | "medium" | "low";
}

export interface AnalysisStep {
  id: string;
  label: string;
  description: string;
  duration: number; // ms for simulation
}
