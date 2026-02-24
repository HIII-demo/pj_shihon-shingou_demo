// ============================================================
// データ生成器 - スケール前提でデータを増やすためのユーティリティ
// ============================================================

import { Project, ProjectFile, ExtractionElement } from "../data/types";

let idCounter = 1000;
const nextId = (prefix: string) => `${prefix}-${String(++idCounter).padStart(4, "0")}`;

const statuses: Project["status"][] = [
  "draft", "uploading", "analyzing", "extracted", "generating", "review", "approved", "archived",
];
const clients = [
  "東日本旅客鉄道株式会社",
  "東海旅客鉄道株式会社",
  "西日本旅客鉄道株式会社",
  "東京メトロ",
  "大阪メトロ",
];
const assignees = ["田中 太郎", "鈴木 一郎", "佐藤 花子", "高橋 健太", "山田 美咲"];
const prefixes = ["TK", "SY", "OS", "NG", "YK", "FK", "SP"];

export function generateProject(overrides?: Partial<Project>): Project {
  const id = nextId("proj");
  return {
    id,
    name: `生成プロジェクト ${id}`,
    description: "自動生成されたテストプロジェクト",
    status: statuses[Math.floor(Math.random() * statuses.length)],
    clientName: clients[Math.floor(Math.random() * clients.length)],
    projectCode: `${prefixes[Math.floor(Math.random() * prefixes.length)]}-2024-${String(Math.floor(Math.random() * 999)).padStart(4, "0")}`,
    createdAt: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
    updatedAt: new Date().toISOString(),
    assignee: assignees[Math.floor(Math.random() * assignees.length)],
    fileCount: Math.floor(Math.random() * 8) + 2,
    extractedElementCount: Math.floor(Math.random() * 60),
    ...overrides,
  };
}

export function generateFile(projectId: string, overrides?: Partial<ProjectFile>): ProjectFile {
  const id = nextId("file");
  return {
    id,
    projectId,
    name: `自動生成図面_${id}.pdf`,
    type: "drawing",
    format: "pdf",
    size: Math.floor(Math.random() * 5000000) + 500000,
    version: 1,
    uploadedAt: new Date().toISOString(),
    uploadedBy: assignees[Math.floor(Math.random() * assignees.length)],
    ...overrides,
  };
}

export function generateElement(projectId: string, fileId: string, overrides?: Partial<ExtractionElement>): ExtractionElement {
  const id = nextId("elem");
  const categories: ExtractionElement["category"][] = ["dimension", "material", "annotation", "part", "tolerance", "surface"];
  return {
    id,
    projectId,
    fileId,
    category: categories[Math.floor(Math.random() * categories.length)],
    key: `自動抽出要素 ${id}`,
    value: String(Math.floor(Math.random() * 1000)),
    unit: "mm",
    confidence: Math.random() * 0.3 + 0.7,
    sourceFileId: fileId,
    bbox: { x: Math.random() * 500, y: Math.random() * 400, w: 80, h: 20 },
    pageNumber: 1,
    verified: Math.random() > 0.5,
    ...overrides,
  };
}
