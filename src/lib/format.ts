import { ProjectStatus } from "@/mock/data/types";

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return `${formatDate(iso)} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const statusConfig: Record<
  ProjectStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  draft: { label: "下書き", variant: "secondary" },
  uploading: { label: "アップロード中", variant: "outline" },
  analyzing: { label: "解析中", variant: "outline" },
  extracted: { label: "抽出完了", variant: "default" },
  generating: { label: "生成中", variant: "outline" },
  review: { label: "レビュー中", variant: "destructive" },
  approved: { label: "承認済", variant: "default" },
  archived: { label: "アーカイブ", variant: "secondary" },
};

export function confidenceColor(c: number): string {
  if (c >= 0.95) return "text-emerald-700 bg-emerald-50";
  if (c >= 0.85) return "text-amber-700 bg-amber-50";
  return "text-red-700 bg-red-50";
}

export function severityColor(s: "high" | "medium" | "low"): string {
  if (s === "high") return "text-red-700 bg-red-50 border-red-200";
  if (s === "medium") return "text-amber-700 bg-amber-50 border-amber-200";
  return "text-slate-600 bg-slate-50 border-slate-200";
}
