"use client";

import { useEffect, useState } from "react";
import { fetchAuditLog } from "@/mock/api";
import { AuditLogEntry } from "@/mock/data/types";
import { formatDateTime } from "@/lib/format";
import {
  Upload,
  Play,
  FileText,
  MessageSquare,
  Settings,
  History,
} from "lucide-react";

const categoryConfig: Record<
  string,
  { icon: React.ElementType; color: string }
> = {
  file: { icon: Upload, color: "text-blue-600 bg-blue-50" },
  analysis: { icon: Play, color: "text-purple-600 bg-purple-50" },
  draft: { icon: FileText, color: "text-amber-600 bg-amber-50" },
  review: { icon: MessageSquare, color: "text-emerald-600 bg-emerald-50" },
  system: { icon: Settings, color: "text-slate-500 bg-slate-50" },
};

export function HistoryTab({ projectId }: { projectId: string }) {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);

  useEffect(() => {
    fetchAuditLog(projectId).then(setLogs);
  }, [projectId]);

  if (logs.length === 0) {
    return (
      <div className="border rounded-md bg-card p-8 text-center">
        <History className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-50" />
        <p className="text-sm text-muted-foreground">履歴はまだありません</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">
        監査ログ ({logs.length} 件)
      </h3>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[19px] top-3 bottom-3 w-px bg-border" />

        <div className="space-y-0">
          {logs.map((log) => {
            const cc = categoryConfig[log.category] ?? categoryConfig.system;
            const Icon = cc.icon;
            return (
              <div key={log.id} className="relative flex gap-4 pb-6">
                {/* Icon */}
                <div
                  className={`relative z-10 h-10 w-10 rounded-md flex items-center justify-center shrink-0 ${cc.color}`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{log.action}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDateTime(log.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {log.detail}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    実行者: {log.user}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
