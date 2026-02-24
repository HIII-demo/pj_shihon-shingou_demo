"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchProject, fetchVersionDiffs } from "@/mock/api";
import { Project, VersionDiff } from "@/mock/data/types";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { severityColor } from "@/lib/format";
import {
  ArrowLeft,
  ArrowRight,
  GitCompareArrows,
  Minus,
  Plus,
  RefreshCw,
} from "lucide-react";

const changeTypeLabels: Record<string, { label: string; icon: React.ElementType }> = {
  dimension: { label: "寸法変更", icon: RefreshCw },
  annotation: { label: "注記変更", icon: RefreshCw },
  material: { label: "材料変更", icon: RefreshCw },
  tolerance: { label: "公差変更", icon: RefreshCw },
  added: { label: "追加", icon: Plus },
  removed: { label: "削除", icon: Minus },
};

export default function ComparePage() {
  const params = useParams();
  const id = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [diffs, setDiffs] = useState<VersionDiff[]>([]);

  useEffect(() => {
    fetchProject(id).then(setProject);
    fetchVersionDiffs(id).then(setDiffs);
  }, [id]);

  if (!project) {
    return (
      <div className="p-6 text-center text-muted-foreground">読み込み中...</div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start gap-3 mb-6">
        <Link
          href={`/projects/${id}`}
          className="mt-1 p-1 rounded-md hover:bg-accent transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <GitCompareArrows className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-semibold">版差分比較</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {project.name}
          </p>
        </div>
      </div>

      {diffs.length === 0 ? (
        <div className="border rounded-md bg-card p-8 text-center">
          <GitCompareArrows className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-50" />
          <p className="text-sm text-muted-foreground">
            比較可能な版差分データがありません
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            同一図面の複数版がアップロードされると、差分が表示されます
          </p>
        </div>
      ) : (
        diffs.map((diff) => (
          <div key={diff.id} className="space-y-4">
            {/* Version comparison header */}
            <div className="flex items-center gap-4 p-4 border rounded-md bg-card">
              <div className="flex-1 text-center">
                <p className="text-xs text-muted-foreground mb-1">旧版</p>
                <p className="text-sm font-medium">{diff.fileNameA}</p>
                <Badge variant="secondary" className="text-xs mt-1">
                  Rev.{diff.versionA}
                </Badge>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="flex-1 text-center">
                <p className="text-xs text-muted-foreground mb-1">新版</p>
                <p className="text-sm font-medium">{diff.fileNameB}</p>
                <Badge variant="secondary" className="text-xs mt-1">
                  Rev.{diff.versionB}
                </Badge>
              </div>
            </div>

            {/* Changes summary */}
            <div className="flex items-center gap-3 text-sm">
              <span className="text-muted-foreground">
                変更点: {diff.changes.length} 件
              </span>
              <span className="text-red-600">
                重要: {diff.changes.filter((c) => c.severity === "high").length}
              </span>
              <span className="text-amber-600">
                注意: {diff.changes.filter((c) => c.severity === "medium").length}
              </span>
              <span className="text-slate-500">
                軽微: {diff.changes.filter((c) => c.severity === "low").length}
              </span>
            </div>

            {/* Changes table */}
            <div className="border rounded-md bg-card overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[90px]">種別</TableHead>
                    <TableHead className="min-w-[70px]">重要度</TableHead>
                    <TableHead className="min-w-[160px]">箇所</TableHead>
                    <TableHead className="min-w-[140px]">旧値</TableHead>
                    <TableHead className="min-w-[140px]">新値</TableHead>
                    <TableHead className="min-w-[150px]">影響セクション</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {diff.changes.map((change) => {
                    const ct = changeTypeLabels[change.type] ?? {
                      label: change.type,
                      icon: RefreshCw,
                    };
                    const sc = severityColor(change.severity);
                    return (
                      <TableRow key={change.id}>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {ct.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-1.5 py-0.5 text-xs rounded border ${sc}`}
                          >
                            {change.severity === "high"
                              ? "高"
                              : change.severity === "medium"
                              ? "中"
                              : "低"}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm font-medium">
                          {change.location}
                        </TableCell>
                        <TableCell>
                          {change.oldValue ? (
                            <span className="text-sm font-mono bg-red-50 text-red-700 px-1.5 py-0.5 rounded">
                              {change.oldValue}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              —
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-mono bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">
                            {change.newValue}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {change.impactSections.map((sec) => (
                              <Badge
                                key={sec}
                                variant="outline"
                                className="text-xs"
                              >
                                {sec}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
