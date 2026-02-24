// ============================================================
// 擬似API関数 - Promise + 遅延で擬似的なAPI呼び出しを再現
// ============================================================

import {
  projects,
  files,
  elements,
  similarDrawings,
  similarSpecs,
  drafts,
  reviewItems,
  reviewComments,
  auditLog,
  templates,
  requiredCheckItems,
  versionDiffs,
  analysisSteps,
  generationSteps,
} from "../db";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// --- Projects ---
export async function fetchProjects(params?: {
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) {
  await delay(300);
  let result = [...projects];
  if (params?.search) {
    const q = params.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.projectCode.toLowerCase().includes(q) ||
        p.clientName.toLowerCase().includes(q)
    );
  }
  if (params?.status && params.status !== "all") {
    result = result.filter((p) => p.status === params.status);
  }
  if (params?.sortBy) {
    result.sort((a, b) => {
      const key = params.sortBy as keyof typeof a;
      const va = a[key] ?? "";
      const vb = b[key] ?? "";
      const cmp = String(va).localeCompare(String(vb));
      return params.sortOrder === "desc" ? -cmp : cmp;
    });
  }
  return result;
}

export async function fetchProject(id: string) {
  await delay(200);
  return projects.find((p) => p.id === id) ?? null;
}

// --- Files ---
export async function fetchFiles(projectId: string) {
  await delay(200);
  return files.filter((f) => f.projectId === projectId);
}

// --- Elements ---
export async function fetchElements(projectId: string) {
  await delay(200);
  return elements.filter((e) => e.projectId === projectId);
}

// --- Similar ---
export async function fetchSimilarDrawings(projectId: string) {
  await delay(300);
  return similarDrawings.filter((s) => s.projectId === projectId);
}

export async function fetchSimilarSpecs(projectId: string) {
  await delay(300);
  return similarSpecs.filter((s) => s.projectId === projectId);
}

// --- Drafts ---
export async function fetchDraft(projectId: string) {
  await delay(200);
  return drafts.find((d) => d.projectId === projectId) ?? null;
}

// --- Reviews ---
export async function fetchReviewItems(projectId: string) {
  await delay(200);
  return reviewItems.filter((r) => r.projectId === projectId);
}

export async function fetchReviewComments(reviewItemId: string) {
  await delay(150);
  return reviewComments.filter((c) => c.reviewItemId === reviewItemId);
}

// --- Audit Log ---
export async function fetchAuditLog(projectId: string) {
  await delay(200);
  const logs = auditLog.filter((l) => l.projectId === projectId);
  return logs.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

// --- Templates ---
export async function fetchTemplates() {
  await delay(200);
  return templates;
}

export async function fetchRequiredCheckItems() {
  await delay(200);
  return requiredCheckItems;
}

// --- Diffs ---
export async function fetchVersionDiffs(projectId: string) {
  await delay(300);
  return versionDiffs.filter((d) => d.projectId === projectId);
}

// --- Analysis Steps ---
export async function fetchAnalysisSteps() {
  await delay(100);
  return analysisSteps;
}

export async function fetchGenerationSteps() {
  await delay(100);
  return generationSteps;
}

// --- Mock generators for demo simulation ---
import type {
  ExtractionElement,
  SimilarDrawing,
  SimilarSpec,
  SpecDraft,
  DraftSection,
} from "../data/types";

export function generateMockElements(projectId: string): ExtractionElement[] {
  return [
    { id: `gen-e-1-${projectId}`, projectId, fileId: "file-gen-1", category: "dimension", key: "外形寸法（幅）", value: "600", unit: "mm", confidence: 0.96, sourceFileId: "file-gen-1", bbox: { x: 120, y: 80, w: 60, h: 20 }, pageNumber: 1, verified: false },
    { id: `gen-e-2-${projectId}`, projectId, fileId: "file-gen-1", category: "dimension", key: "外形寸法（高さ）", value: "1800", unit: "mm", confidence: 0.94, sourceFileId: "file-gen-1", bbox: { x: 200, y: 50, w: 60, h: 20 }, pageNumber: 1, verified: false },
    { id: `gen-e-3-${projectId}`, projectId, fileId: "file-gen-1", category: "dimension", key: "外形寸法（奥行）", value: "400", unit: "mm", confidence: 0.91, sourceFileId: "file-gen-1", bbox: { x: 300, y: 120, w: 50, h: 20 }, pageNumber: 1, verified: false },
    { id: `gen-e-4-${projectId}`, projectId, fileId: "file-gen-1", category: "material", key: "筐体 材質", value: "SS400", unit: "", confidence: 0.93, sourceFileId: "file-gen-1", bbox: { x: 400, y: 300, w: 80, h: 20 }, pageNumber: 1, verified: false },
    { id: `gen-e-5-${projectId}`, projectId, fileId: "file-gen-1", category: "annotation", key: "防水規格", value: "IP44", unit: "", confidence: 0.97, sourceFileId: "file-gen-1", bbox: { x: 500, y: 50, w: 60, h: 20 }, pageNumber: 1, verified: false },
    { id: `gen-e-6-${projectId}`, projectId, fileId: "file-gen-1", category: "part", key: "制御ユニット", value: "NS-CU-200", unit: "", confidence: 0.89, sourceFileId: "file-gen-1", bbox: { x: 150, y: 250, w: 100, h: 20 }, pageNumber: 1, verified: false },
    { id: `gen-e-7-${projectId}`, projectId, fileId: "file-gen-1", category: "tolerance", key: "一般公差", value: "±1.5", unit: "mm", confidence: 0.92, sourceFileId: "file-gen-1", bbox: { x: 10, y: 550, w: 80, h: 15 }, pageNumber: 1, verified: false },
    { id: `gen-e-8-${projectId}`, projectId, fileId: "file-gen-1", category: "surface", key: "表面処理", value: "溶融亜鉛めっき", unit: "", confidence: 0.88, sourceFileId: "file-gen-1", bbox: { x: 400, y: 110, w: 110, h: 20 }, pageNumber: 1, verified: false },
  ];
}

export function generateMockSimilarDrawings(projectId: string): SimilarDrawing[] {
  return [
    { id: `gen-sd-1-${projectId}`, projectId, similarProjectId: "proj-001", similarProjectName: "東京駅北口 信号制御盤 改修", similarFileName: "信号制御盤_外形図_Rev2.pdf", score: 0.76, reason: "同系統の制御装置。筐体構造が類似。" },
  ];
}

export function generateMockSimilarSpecs(projectId: string): SimilarSpec[] {
  return [
    { id: `gen-ss-1-${projectId}`, projectId, specTitle: "東京駅北口 信号制御盤 仕様書", specCode: "TK-2024-SPEC-0142", score: 0.72, reason: "同分野の制御装置仕様書。環境条件・試験項目が参考になる。", sections: ["3. 環境条件", "5. 試験要件"] },
  ];
}

export function generateMockDraft(projectId: string, templateName: string): SpecDraft {
  const draftId = `draft-gen-${projectId}`;
  const sections: DraftSection[] = [
    { id: `sec-gen-1`, draftId, sectionNumber: "1", title: "概要", content: "## 1. 概要\n\n### 1.1 目的\n本仕様書は、対象機器の技術仕様を定めるものである。\n\n### 1.2 適用範囲\n本仕様書は、対象機器本体および付属品に適用する。\n\n### 1.3 適用規格\n- JIS C 0920\n- 日本信号社内規格 NS-STD-2024", sourceElements: [], status: "auto" },
    { id: `sec-gen-2`, draftId, sectionNumber: "2", title: "外形仕様", content: "## 2. 外形仕様\n\n### 2.1 外形寸法\n| 項目 | 仕様 |\n|------|------|\n| 幅 | 600 mm |\n| 高さ | 1800 mm |\n| 奥行 | 400 mm |\n\n### 2.2 材質・仕上げ\n| 項目 | 仕様 |\n|------|------|\n| 筐体材質 | SS400 |\n| 表面処理 | 溶融亜鉛めっき |\n\n### 2.3 保護等級\n- 防水・防塵規格: IP44", sourceElements: ["gen-e-1", "gen-e-2", "gen-e-3", "gen-e-4", "gen-e-5", "gen-e-8"], status: "auto" },
    { id: `sec-gen-3`, draftId, sectionNumber: "3", title: "環境条件", content: "## 3. 環境条件\n\n### 3.1 設置環境\n- 使用温度範囲: -20℃〜+55℃\n- 使用湿度範囲: 30%〜90%RH（結露なきこと）\n\n### 3.2 耐環境性能\n- 耐振動: JIS E 3013 準拠", sourceElements: [], status: "auto" },
    { id: `sec-gen-4`, draftId, sectionNumber: "4", title: "機能仕様", content: "## 4. 機能仕様\n\n### 4.1 制御機能\n- 制御ユニット: NS-CU-200\n- 電源: AC100V\n\n### 4.2 通信機能\n- 上位通信: Ethernet（TCP/IP）", sourceElements: ["gen-e-6"], status: "auto" },
    { id: `sec-gen-5`, draftId, sectionNumber: "5", title: "試験要件", content: "## 5. 試験要件\n\n### 5.1 工場試験\n| No. | 試験項目 | 判定基準 |\n|-----|----------|----------|\n| 1 | 絶縁抵抗試験 | 10MΩ以上 |\n| 2 | 耐電圧試験 | 異常なきこと |\n| 3 | 動作試験 | 仕様通り動作 |", sourceElements: [], status: "auto" },
  ];
  return {
    id: draftId,
    projectId,
    templateId: "tmpl-gen",
    templateName,
    version: 1,
    status: "draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sections,
  };
}
