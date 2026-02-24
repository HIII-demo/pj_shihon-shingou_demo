"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { fetchProjects } from "@/mock/api";
import { Project } from "@/mock/data/types";
import { formatDate, statusConfig } from "@/lib/format";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ArrowUpDown, Plus, ChevronRight } from "lucide-react";

export default function ProjectListPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<string>("updatedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects().then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    let result = [...projects];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.projectCode.toLowerCase().includes(q) ||
          p.clientName.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter);
    }
    result.sort((a, b) => {
      const va = String(a[sortBy as keyof Project] ?? "");
      const vb = String(b[sortBy as keyof Project] ?? "");
      const cmp = va.localeCompare(vb);
      return sortOrder === "desc" ? -cmp : cmp;
    });
    return result;
  }, [projects, search, statusFilter, sortBy, sortOrder]);

  const toggleSort = (col: string) => {
    if (sortBy === col) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setSortOrder("asc");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">案件一覧</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            全 {projects.length} 件の案件を管理
          </p>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          新規案件
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="案件名・コード・顧客名で検索..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px] h-9">
            <SelectValue placeholder="ステータス" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            <SelectItem value="draft">下書き</SelectItem>
            <SelectItem value="analyzing">解析中</SelectItem>
            <SelectItem value="extracted">抽出完了</SelectItem>
            <SelectItem value="review">レビュー中</SelectItem>
            <SelectItem value="approved">承認済</SelectItem>
            <SelectItem value="archived">アーカイブ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-md bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[220px]">
                <button
                  onClick={() => toggleSort("name")}
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  案件名
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead className="min-w-[130px]">案件コード</TableHead>
              <TableHead className="min-w-[100px]">顧客</TableHead>
              <TableHead className="min-w-[90px]">ステータス</TableHead>
              <TableHead className="min-w-[70px] text-center">ファイル</TableHead>
              <TableHead className="min-w-[70px] text-center">抽出要素</TableHead>
              <TableHead className="min-w-[80px]">担当者</TableHead>
              <TableHead className="min-w-[90px]">
                <button
                  onClick={() => toggleSort("updatedAt")}
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  更新日
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead className="w-[40px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  読み込み中...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  該当する案件がありません
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((p) => {
                const sc = statusConfig[p.status];
                return (
                  <TableRow key={p.id} className="group">
                    <TableCell>
                      <Link
                        href={`/projects/${p.id}`}
                        className="font-medium text-sm hover:underline"
                      >
                        {p.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground font-mono">
                      {p.projectCode}
                    </TableCell>
                    <TableCell className="text-sm">{p.clientName}</TableCell>
                    <TableCell>
                      <Badge variant={sc.variant} className="text-xs">
                        {sc.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      {p.fileCount}
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      {p.extractedElementCount}
                    </TableCell>
                    <TableCell className="text-sm">{p.assignee}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(p.updatedAt)}
                    </TableCell>
                    <TableCell>
                      <Link href={`/projects/${p.id}`}>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
