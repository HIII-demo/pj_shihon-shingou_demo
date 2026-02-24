"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchReviewItems, fetchReviewComments } from "@/mock/api";
import { ReviewItem, ReviewComment } from "@/mock/data/types";
import { formatDateTime } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  Lightbulb,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Send,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

const typeConfig: Record<string, { icon: React.ElementType; label: string; iconColor: string }> = {
  missing: { icon: AlertCircle, label: "未記載", iconColor: "text-red-500" },
  inconsistency: { icon: AlertTriangle, label: "不整合", iconColor: "text-amber-500" },
  warning: { icon: Info, label: "注意", iconColor: "text-blue-500" },
  suggestion: { icon: Lightbulb, label: "提案", iconColor: "text-slate-400" },
};

const severityConfig: Record<string, { label: string; color: string }> = {
  high: { label: "高", color: "text-red-700 bg-red-50 border-red-200" },
  medium: { label: "中", color: "text-amber-700 bg-amber-50 border-amber-200" },
  low: { label: "低", color: "text-slate-600 bg-slate-50 border-slate-200" },
};

const statusLabels: Record<string, { label: string; color: string }> = {
  open: { label: "対応中", color: "bg-amber-50 text-amber-700" },
  resolved: { label: "解決済", color: "bg-emerald-50 text-emerald-700" },
  dismissed: { label: "却下", color: "bg-slate-100 text-slate-500" },
};

export function ReviewTab({ projectId }: { projectId: string }) {
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [commentsMap, setCommentsMap] = useState<Record<string, ReviewComment[]>>({});
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [commentAdded, setCommentAdded] = useState(false);

  useEffect(() => {
    fetchReviewItems(projectId).then(setItems);
  }, [projectId]);

  const toggleExpand = useCallback(
    async (itemId: string) => {
      if (expandedItem === itemId) {
        setExpandedItem(null);
        return;
      }
      setExpandedItem(itemId);
      setNewComment("");
      if (!commentsMap[itemId]) {
        const comments = await fetchReviewComments(itemId).catch(() => []);
        setCommentsMap((prev) => ({ ...prev, [itemId]: comments }));
      }
    },
    [expandedItem, commentsMap]
  );

  const handleAddComment = useCallback(
    (itemId: string) => {
      if (!newComment.trim()) return;
      const comment: ReviewComment = {
        id: `cmt-new-${Date.now()}`,
        reviewItemId: itemId,
        author: "田中 太郎",
        content: newComment,
        createdAt: new Date().toISOString(),
      };
      setCommentsMap((prev) => ({
        ...prev,
        [itemId]: [...(prev[itemId] ?? []), comment],
      }));
      setNewComment("");
      setCommentAdded(true);
      setTimeout(() => setCommentAdded(false), 2000);
    },
    [newComment]
  );

  const handleStatusChange = useCallback(
    (itemId: string, status: "resolved" | "dismissed") => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, status } : item
        )
      );
    },
    []
  );

  const openCount = items.filter((i) => i.status === "open").length;
  const resolvedCount = items.filter((i) => i.status === "resolved").length;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center gap-4 px-1">
        <div className="flex items-center gap-1.5 text-sm">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <span>
            対応中: <strong>{openCount}</strong>
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-sm">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>
            解決済: <strong>{resolvedCount}</strong>
          </span>
        </div>
        <div className="text-sm text-muted-foreground">
          全 {items.length} 件
        </div>
      </div>

      {/* Review Items */}
      <div className="space-y-2">
        {items.map((item) => {
          const tc = typeConfig[item.type];
          const sev = severityConfig[item.severity];
          const st = statusLabels[item.status];
          const isExpanded = expandedItem === item.id;
          const comments = commentsMap[item.id] ?? [];
          const TypeIcon = tc.icon;

          return (
            <div key={item.id} className="border rounded-md bg-card">
              {/* Header */}
              <button
                type="button"
                onClick={() => toggleExpand(item.id)}
                className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-accent/50 transition-colors"
              >
                <div className="mt-0.5 shrink-0">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <TypeIcon className={`h-4 w-4 mt-0.5 shrink-0 ${tc.iconColor}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium">{item.title}</span>
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 text-xs rounded border ${sev.color}`}
                    >
                      {sev.label}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {tc.label}
                    </Badge>
                    <span className={`inline-flex items-center px-1.5 py-0.5 text-xs rounded ${st.color}`}>
                      {st.label}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                    {item.description}
                  </p>
                </div>
                {item.assignee && (
                  <span className="text-xs text-muted-foreground shrink-0 mt-0.5">
                    {item.assignee}
                  </span>
                )}
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="border-t px-4 py-3">
                  <p className="text-sm mb-3">{item.description}</p>
                  <div className="text-xs text-muted-foreground mb-3">
                    対象セクション: {item.sectionId}
                  </div>

                  {/* Status actions */}
                  {item.status === "open" && (
                    <div className="flex gap-2 mb-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 h-7 text-xs"
                        onClick={() => handleStatusChange(item.id, "resolved")}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        解決済みにする
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 h-7 text-xs text-muted-foreground"
                        onClick={() => handleStatusChange(item.id, "dismissed")}
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        却下
                      </Button>
                    </div>
                  )}

                  <Separator className="my-3" />

                  {/* Comments */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MessageSquare className="h-3.5 w-3.5" />
                      コメント ({comments.length})
                    </div>
                    {comments.map((c) => (
                      <div key={c.id} className="flex gap-3">
                        <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center text-xs font-medium text-primary shrink-0">
                          {c.author.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium">{c.author}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDateTime(c.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm mt-0.5">{c.content}</p>
                        </div>
                      </div>
                    ))}

                    {/* New comment */}
                    <div className="flex gap-2 mt-2">
                      <Textarea
                        placeholder="コメントを入力..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="min-h-[60px] text-sm"
                      />
                      <div className="flex flex-col gap-1">
                        <Button
                          size="sm"
                          className="h-auto px-3 flex-1"
                          onClick={() => handleAddComment(item.id)}
                          disabled={!newComment.trim()}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                        {commentAdded && (
                          <span className="text-xs text-emerald-600 text-center">送信済</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
