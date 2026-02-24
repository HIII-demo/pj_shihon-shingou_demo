"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { fetchDraft, fetchTemplates, fetchGenerationSteps, generateMockDraft } from "@/mock/api";
import { SpecDraft, Template, AnalysisStep, DraftSection } from "@/mock/data/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sparkles,
  CheckCircle2,
  Loader2,
  Pencil,
  Save,
  FileText,
} from "lucide-react";

const sectionStatusConfig: Record<string, { label: string; color: string }> = {
  auto: { label: "自動生成", color: "bg-blue-50 text-blue-700" },
  edited: { label: "編集済", color: "bg-amber-50 text-amber-700" },
  approved: { label: "承認済", color: "bg-emerald-50 text-emerald-700" },
};

/* eslint-disable @typescript-eslint/no-explicit-any */
const markdownComponents = {
  h2: (props: any) => (
    <h2 className="text-base font-semibold mb-3 mt-0" {...props} />
  ),
  h3: (props: any) => (
    <h3 className="text-sm font-semibold mt-4 mb-2" {...props} />
  ),
  p: (props: any) => <p className="mb-2 leading-relaxed" {...props} />,
  ul: (props: any) => (
    <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />
  ),
  li: (props: any) => <li className="leading-relaxed" {...props} />,
  table: (props: any) => (
    <table className="w-full mb-3 text-[0.8125rem] border-collapse" {...props} />
  ),
  thead: (props: any) => <thead {...props} />,
  th: (props: any) => (
    <th
      className="text-left font-semibold px-3 py-2 border-b-2 border-border bg-muted/50"
      {...props}
    />
  ),
  td: (props: any) => (
    <td className="px-3 py-1.5 border-b border-border" {...props} />
  ),
};
/* eslint-enable @typescript-eslint/no-explicit-any */

export function DraftTab({ projectId }: { projectId: string }) {
  const [draft, setDraft] = useState<SpecDraft | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [genSteps, setGenSteps] = useState<AnalysisStep[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const [generating, setGenerating] = useState(false);
  const [genCurrentStep, setGenCurrentStep] = useState(-1);
  const [genProgress, setGenProgress] = useState(0);
  const [genCompleted, setGenCompleted] = useState(false);

  const [editingSection, setEditingSection] = useState<DraftSection | null>(null);
  const [editContent, setEditContent] = useState("");

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetchDraft(projectId).then(setDraft);
    fetchTemplates().then((t) => {
      setTemplates(t);
      if (t.length > 0) setSelectedTemplate(t[0].id);
    });
    fetchGenerationSteps().then(setGenSteps);
  }, [projectId]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const selectedTemplateName = templates.find((t) => t.id === selectedTemplate)?.name ?? "仕様書テンプレート";

  const runGeneration = useCallback(() => {
    if (generating) return;
    setGenerating(true);
    setGenCurrentStep(0);
    setGenProgress(0);
    setGenCompleted(false);

    let step = 0;
    const runStep = () => {
      if (step >= genSteps.length) {
        setGenerating(false);
        setGenCompleted(true);
        setDraft((prev) => prev ?? generateMockDraft(projectId, selectedTemplateName));
        return;
      }
      setGenCurrentStep(step);
      setGenProgress(0);
      const duration = genSteps[step].duration;
      const interval = 50;
      let elapsed = 0;
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        elapsed += interval;
        setGenProgress(Math.min((elapsed / duration) * 100, 100));
        if (elapsed >= duration) {
          if (timerRef.current) clearInterval(timerRef.current);
          step++;
          runStep();
        }
      }, interval);
    };
    runStep();
  }, [genSteps, generating, projectId, selectedTemplateName]);

  const handleEditSave = useCallback(() => {
    if (!editingSection || !draft) return;
    setDraft({
      ...draft,
      sections: draft.sections.map((s) =>
        s.id === editingSection.id
          ? { ...s, content: editContent, status: "edited" as const }
          : s
      ),
    });
    setEditingSection(null);
  }, [editingSection, editContent, draft]);

  // No draft yet - show generation UI
  if (!draft && !generating && !genCompleted) {
    return (
      <div className="space-y-6">
        <div className="border rounded-md bg-card p-8 text-center">
          <Sparkles className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
          <h3 className="font-medium mb-1">仕様書ドラフトを生成</h3>
          <p className="text-sm text-muted-foreground mb-4">
            テンプレートを選択し、抽出要素からドラフトを自動生成します
          </p>
          <div className="flex items-center gap-3 justify-center mb-4">
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="テンプレートを選択" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={runGeneration} className="gap-1.5">
            <Sparkles className="h-4 w-4" />
            ドラフト生成
          </Button>
        </div>
      </div>
    );
  }

  // Generation progress (before draft exists)
  if (!draft && (generating || genCompleted)) {
    return (
      <div className="space-y-6">
        <div className="border rounded-md bg-card p-6">
          <h3 className="font-medium mb-4">
            {generating ? "ドラフト生成中..." : "生成完了"}
          </h3>
          <div className="space-y-3">
            {genSteps.map((step, i) => (
              <div key={step.id} className="flex items-center gap-3">
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  {i < genCurrentStep || genCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  ) : i === genCurrentStep && generating ? (
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  ) : (
                    <div className="h-3 w-3 rounded-full border-2 border-muted-foreground/30" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-sm ${
                        i <= genCurrentStep || genCompleted
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                    {i === genCurrentStep && generating && (
                      <span className="text-xs text-muted-foreground">
                        {Math.round(genProgress)}%
                      </span>
                    )}
                  </div>
                  {i === genCurrentStep && generating && (
                    <>
                      <Progress value={genProgress} className="h-1.5" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {step.description}
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          {genCompleted && (
            <div className="mt-4 pt-4 border-t flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <p className="text-sm text-emerald-700">ドラフト生成が完了しました。</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!draft) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">
            {draft.templateName} (v{draft.version})
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {draft.sections.length} セクション
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={runGeneration}
          disabled={generating}
        >
          {generating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          再生成
        </Button>
      </div>

      {generating && (
        <div className="border rounded-md bg-card p-4">
          <div className="space-y-2">
            {genSteps.map((step, i) => (
              <div key={step.id} className="flex items-center gap-3">
                <div className="w-4 h-4 flex items-center justify-center shrink-0">
                  {i < genCurrentStep ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  ) : i === genCurrentStep ? (
                    <Loader2 className="h-4 w-4 text-primary animate-spin" />
                  ) : (
                    <div className="h-2.5 w-2.5 rounded-full border-2 border-muted-foreground/30" />
                  )}
                </div>
                <span className={`text-sm ${i <= genCurrentStep ? "text-foreground" : "text-muted-foreground"}`}>
                  {step.label}
                </span>
                {i === genCurrentStep && (
                  <div className="flex-1">
                    <Progress value={genProgress} className="h-1" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {draft.sections.map((section) => {
          const sc = sectionStatusConfig[section.status];
          return (
            <div key={section.id} className="border rounded-md bg-card">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-sm font-medium truncate">
                    {section.sectionNumber}. {section.title}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 text-xs rounded shrink-0 ${sc.color}`}
                  >
                    {sc.label}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 h-7 shrink-0"
                  onClick={() => {
                    setEditingSection(section);
                    setEditContent(section.content);
                  }}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  編集
                </Button>
              </div>
              <div className="px-4 py-3">
                <div className="max-w-none text-sm leading-relaxed">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={markdownComponents}
                  >
                    {section.content}
                  </ReactMarkdown>
                </div>
              </div>
              {section.sourceElements.length > 0 && (
                <div className="px-4 py-2 border-t bg-muted/30">
                  <span className="text-xs text-muted-foreground">
                    根拠要素: {section.sourceElements.length} 件
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Dialog
        open={!!editingSection}
        onOpenChange={() => setEditingSection(null)}
      >
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base">
              セクション編集: {editingSection?.sectionNumber}. {editingSection?.title}
            </DialogTitle>
          </DialogHeader>
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="min-h-[400px] font-mono text-sm"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditingSection(null)}>
              キャンセル
            </Button>
            <Button onClick={handleEditSave} className="gap-1.5">
              <Save className="h-4 w-4" />
              保存
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
