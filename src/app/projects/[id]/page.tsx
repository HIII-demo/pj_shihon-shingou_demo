"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchProject } from "@/mock/api";
import { Project } from "@/mock/data/types";
import { statusConfig } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, GitCompareArrows } from "lucide-react";
import { FilesTab } from "@/components/project/files-tab";
import { AnalysisTab } from "@/components/project/analysis-tab";
import { DraftTab } from "@/components/project/draft-tab";
import { ReviewTab } from "@/components/project/review-tab";
import { HistoryTab } from "@/components/project/history-tab";

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    fetchProject(id).then(setProject);
  }, [id]);

  if (!project) {
    return (
      <div className="p-6 text-center text-muted-foreground">読み込み中...</div>
    );
  }

  const sc = statusConfig[project.status];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-3">
          <Link
            href="/"
            className="mt-1 p-1 rounded-md hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">{project.name}</h1>
              <Badge variant={sc.variant} className="text-xs">
                {sc.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {project.projectCode} | {project.clientName} | 担当: {project.assignee}
            </p>
          </div>
        </div>
        <Link href={`/projects/${id}/compare`}>
          <Button variant="outline" size="sm" className="gap-1.5">
            <GitCompareArrows className="h-4 w-4" />
            版差分
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="files">
        <TabsList>
          <TabsTrigger value="files">ファイル</TabsTrigger>
          <TabsTrigger value="analysis">解析結果</TabsTrigger>
          <TabsTrigger value="draft">仕様書ドラフト</TabsTrigger>
          <TabsTrigger value="review">レビュー</TabsTrigger>
          <TabsTrigger value="history">履歴</TabsTrigger>
        </TabsList>

        <TabsContent value="files" className="mt-4">
          <FilesTab projectId={id} />
        </TabsContent>
        <TabsContent value="analysis" className="mt-4">
          <AnalysisTab projectId={id} />
        </TabsContent>
        <TabsContent value="draft" className="mt-4">
          <DraftTab projectId={id} />
        </TabsContent>
        <TabsContent value="review" className="mt-4">
          <ReviewTab projectId={id} />
        </TabsContent>
        <TabsContent value="history" className="mt-4">
          <HistoryTab projectId={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
