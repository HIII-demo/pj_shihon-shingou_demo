"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchFiles } from "@/mock/api";
import { ProjectFile } from "@/mock/data/types";
import { formatDateTime, formatFileSize } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload, FileText, FileSpreadsheet, FileImage, Eye, CheckCircle2 } from "lucide-react";

function FileIcon({ format }: { format: string }) {
  switch (format) {
    case "xlsx":
      return <FileSpreadsheet className="h-4 w-4 text-emerald-600" />;
    case "png":
    case "jpg":
      return <FileImage className="h-4 w-4 text-purple-600" />;
    case "docx":
      return <FileText className="h-4 w-4 text-blue-500" />;
    default:
      return <FileText className="h-4 w-4 text-red-500" />;
  }
}

const typeLabels: Record<string, string> = {
  drawing: "図面",
  specification: "設計資料",
  reference: "参考資料",
};

export function FilesTab({ projectId }: { projectId: string }) {
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);

  useEffect(() => {
    fetchFiles(projectId).then(setFiles);
  }, [projectId]);

  const handleUpload = useCallback(() => {
    setUploading(true);
    setUploadDone(false);
    setTimeout(() => {
      const newFile: ProjectFile = {
        id: `file-new-${Date.now()}`,
        projectId,
        name: "新規図面_アップロード.pdf",
        type: "drawing",
        format: "pdf",
        size: 1850000,
        version: 1,
        uploadedAt: new Date().toISOString(),
        uploadedBy: "田中 太郎",
      };
      setFiles((prev) => [newFile, ...prev]);
      setUploading(false);
      setUploadDone(true);
      setTimeout(() => setUploadDone(false), 2000);
    }, 1500);
  }, [projectId]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-muted-foreground">
          {files.length} 件のファイル
        </h2>
        <div className="flex items-center gap-2">
          {uploadDone && (
            <span className="flex items-center gap-1 text-xs text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
              追加しました
            </span>
          )}
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={handleUpload}
            disabled={uploading}
          >
            <Upload className="h-4 w-4" />
            {uploading ? "アップロード中..." : "ファイル追加"}
          </Button>
        </div>
      </div>

      <div className="border rounded-md bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[280px]">ファイル名</TableHead>
              <TableHead className="min-w-[80px]">種別</TableHead>
              <TableHead className="min-w-[60px]">版数</TableHead>
              <TableHead className="min-w-[70px]">サイズ</TableHead>
              <TableHead className="min-w-[90px]">アップロード者</TableHead>
              <TableHead className="min-w-[130px]">アップロード日時</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((f) => (
              <TableRow key={f.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FileIcon format={f.format} />
                    <span className="text-sm">{f.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {typeLabels[f.type] ?? f.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">Rev.{f.version}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatFileSize(f.size)}
                </TableCell>
                <TableCell className="text-sm">{f.uploadedBy}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDateTime(f.uploadedAt)}
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        aria-label="プレビューを表示"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-base">{f.name}</DialogTitle>
                      </DialogHeader>
                      <div className="bg-muted rounded-md relative min-h-[400px] overflow-hidden">
                        {/* Simulated drawing */}
                        <svg className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <pattern id="preview-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill="url(#preview-grid)" />
                        </svg>
                        <svg className="absolute inset-0 w-full h-full opacity-[0.15]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400">
                          <rect x="40" y="30" width="420" height="310" fill="none" stroke="currentColor" strokeWidth="2"/>
                          <rect x="40" y="310" width="420" height="30" fill="none" stroke="currentColor" strokeWidth="1"/>
                          <text x="250" y="330" textAnchor="middle" fontSize="8" fill="currentColor">{f.name}</text>
                          <rect x="80" y="60" width="160" height="120" fill="none" stroke="currentColor" strokeWidth="1"/>
                          <rect x="280" y="80" width="140" height="90" fill="none" stroke="currentColor" strokeWidth="1"/>
                          <line x1="80" y1="220" x2="420" y2="220" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4,4"/>
                          <circle cx="160" cy="120" r="30" fill="none" stroke="currentColor" strokeWidth="0.8"/>
                          <line x1="130" y1="120" x2="190" y2="120" stroke="currentColor" strokeWidth="0.5"/>
                          <line x1="160" y1="90" x2="160" y2="150" stroke="currentColor" strokeWidth="0.5"/>
                        </svg>
                        <div className="absolute bottom-3 right-3 bg-card/90 backdrop-blur-sm border rounded-md px-3 py-2 text-xs">
                          <p className="font-medium">{f.name}</p>
                          <p className="text-muted-foreground">{formatFileSize(f.size)} | Rev.{f.version}</p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
