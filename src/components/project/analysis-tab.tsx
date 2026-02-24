"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  fetchElements,
  fetchSimilarDrawings,
  fetchSimilarSpecs,
  fetchAnalysisSteps,
  generateMockElements,
  generateMockSimilarDrawings,
  generateMockSimilarSpecs,
} from "@/mock/api";
import {
  ExtractionElement,
  SimilarDrawing,
  SimilarSpec,
  AnalysisStep,
} from "@/mock/data/types";
import { confidenceColor } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
} from "@/components/ui/dialog";
import {
  Play,
  CheckCircle2,
  Loader2,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

const categoryLabels: Record<string, string> = {
  dimension: "寸法",
  material: "材料",
  annotation: "注記",
  part: "部品",
  tolerance: "公差",
  surface: "表面処理",
};

const categoryColors: Record<string, string> = {
  dimension: "bg-blue-50 text-blue-700 border-blue-200",
  material: "bg-emerald-50 text-emerald-700 border-emerald-200",
  annotation: "bg-purple-50 text-purple-700 border-purple-200",
  part: "bg-orange-50 text-orange-700 border-orange-200",
  tolerance: "bg-cyan-50 text-cyan-700 border-cyan-200",
  surface: "bg-pink-50 text-pink-700 border-pink-200",
};

export function AnalysisTab({ projectId }: { projectId: string }) {
  const [elements, setElements] = useState<ExtractionElement[]>([]);
  const [similarDrawings, setSimilarDrawings] = useState<SimilarDrawing[]>([]);
  const [similarSpecs, setSimilarSpecs] = useState<SimilarSpec[]>([]);
  const [analysisSteps, setAnalysisSteps] = useState<AnalysisStep[]>([]);

  const [analyzing, setAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [stepProgress, setStepProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  const [highlightElement, setHighlightElement] = useState<ExtractionElement | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetchElements(projectId).then(setElements);
    fetchSimilarDrawings(projectId).then(setSimilarDrawings);
    fetchSimilarSpecs(projectId).then(setSimilarSpecs);
    fetchAnalysisSteps().then(setAnalysisSteps);
  }, [projectId]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const hasElements = elements.length > 0;

  const runAnalysis = useCallback(() => {
    if (analyzing) return;
    setAnalyzing(true);
    setCurrentStep(0);
    setStepProgress(0);
    setCompleted(false);

    let step = 0;
    const runStep = () => {
      if (step >= analysisSteps.length) {
        setAnalyzing(false);
        setCompleted(true);
        // Inject generated mock data
        const genElements = generateMockElements(projectId);
        const genSimilarD = generateMockSimilarDrawings(projectId);
        const genSimilarS = generateMockSimilarSpecs(projectId);
        setElements((prev) => (prev.length > 0 ? prev : genElements));
        setSimilarDrawings((prev) => (prev.length > 0 ? prev : genSimilarD));
        setSimilarSpecs((prev) => (prev.length > 0 ? prev : genSimilarS));
        return;
      }
      setCurrentStep(step);
      setStepProgress(0);
      const duration = analysisSteps[step].duration;
      const interval = 50;
      let elapsed = 0;
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        elapsed += interval;
        setStepProgress(Math.min((elapsed / duration) * 100, 100));
        if (elapsed >= duration) {
          if (timerRef.current) clearInterval(timerRef.current);
          step++;
          runStep();
        }
      }, interval);
    };
    runStep();
  }, [analysisSteps, analyzing, projectId]);

  return (
    <div className="space-y-6">
      {/* Analysis Control - show only when no elements and not running */}
      {!hasElements && !analyzing && !completed && (
        <div className="border rounded-md bg-card p-8 text-center">
          <Play className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
          <h3 className="font-medium mb-1">図面解析を実行</h3>
          <p className="text-sm text-muted-foreground mb-4">
            アップロードされた図面をAIが解析し、仕様要素を抽出します
          </p>
          <Button onClick={runAnalysis} className="gap-1.5" disabled={analysisSteps.length === 0}>
            <Play className="h-4 w-4" />
            解析開始
          </Button>
        </div>
      )}

      {/* Analysis Progress */}
      {(analyzing || (completed && !hasElements)) && (
        <div className="border rounded-md bg-card p-6">
          <h3 className="font-medium mb-4">
            {analyzing ? "解析実行中..." : "解析完了"}
          </h3>
          <div className="space-y-3">
            {analysisSteps.map((step, i) => (
              <div key={step.id} className="flex items-center gap-3">
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  {i < currentStep || completed ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  ) : i === currentStep && analyzing ? (
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  ) : (
                    <div className="h-3 w-3 rounded-full border-2 border-muted-foreground/30" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-sm ${
                        i <= currentStep || completed
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                    {i === currentStep && analyzing && (
                      <span className="text-xs text-muted-foreground">
                        {Math.round(stepProgress)}%
                      </span>
                    )}
                  </div>
                  {i === currentStep && analyzing && (
                    <>
                      <Progress value={stepProgress} className="h-1.5" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {step.description}
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          {completed && (
            <div className="mt-4 pt-4 border-t flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <p className="text-sm text-emerald-700">
                解析が完了しました。{elements.length} 件の要素を抽出しました。
              </p>
            </div>
          )}
        </div>
      )}

      {/* Re-run button for projects that already have elements */}
      {hasElements && !analyzing && (
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">
            抽出要素 {elements.length} 件
          </h3>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={runAnalysis}
          >
            <Play className="h-4 w-4" />
            再解析
          </Button>
        </div>
      )}

      {/* Analysis progress when re-running with existing elements */}
      {analyzing && hasElements && (
        <div className="border rounded-md bg-card p-4">
          <div className="space-y-2">
            {analysisSteps.map((step, i) => (
              <div key={step.id} className="flex items-center gap-3">
                <div className="w-4 h-4 flex items-center justify-center shrink-0">
                  {i < currentStep ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  ) : i === currentStep ? (
                    <Loader2 className="h-4 w-4 text-primary animate-spin" />
                  ) : (
                    <div className="h-2.5 w-2.5 rounded-full border-2 border-muted-foreground/30" />
                  )}
                </div>
                <span className={`text-sm ${i <= currentStep ? "text-foreground" : "text-muted-foreground"}`}>
                  {step.label}
                </span>
                {i === currentStep && (
                  <div className="flex-1">
                    <Progress value={stepProgress} className="h-1" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Extraction Elements Table */}
      {hasElements && (
        <div className="border rounded-md bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[90px]">カテゴリ</TableHead>
                <TableHead className="min-w-[160px]">項目</TableHead>
                <TableHead className="min-w-[140px]">値</TableHead>
                <TableHead className="min-w-[50px]">単位</TableHead>
                <TableHead className="min-w-[80px]">信頼度</TableHead>
                <TableHead className="min-w-[70px]">検証</TableHead>
                <TableHead className="w-[50px]">根拠</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {elements.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 text-xs rounded border ${
                        categoryColors[e.category] ?? "bg-gray-50 text-gray-700 border-gray-200"
                      }`}
                    >
                      {categoryLabels[e.category] ?? e.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm font-medium">{e.key}</TableCell>
                  <TableCell className="text-sm font-mono">{e.value}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {e.unit}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 text-xs rounded ${confidenceColor(
                        e.confidence
                      )}`}
                    >
                      {(e.confidence * 100).toFixed(0)}%
                    </span>
                  </TableCell>
                  <TableCell>
                    {e.verified ? (
                      <div className="flex items-center gap-1">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        <span className="text-xs text-emerald-700">済</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">未検証</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => setHighlightElement(e)}
                      aria-label="根拠箇所を表示"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Source highlight dialog */}
      <Dialog
        open={!!highlightElement}
        onOpenChange={() => setHighlightElement(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-base">
              根拠箇所: {highlightElement?.key}
            </DialogTitle>
          </DialogHeader>
          {highlightElement && (
            <div className="relative bg-muted rounded-md min-h-[450px] overflow-hidden">
              {/* Simulated drawing grid */}
              <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
              {/* Simulated drawing lines */}
              <svg className="absolute inset-0 w-full h-full opacity-[0.12]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450">
                <rect x="60" y="40" width="480" height="350" fill="none" stroke="currentColor" strokeWidth="2"/>
                <rect x="60" y="350" width="480" height="40" fill="none" stroke="currentColor" strokeWidth="1"/>
                <line x1="60" y1="100" x2="540" y2="100" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4,4"/>
                <line x1="300" y1="40" x2="300" y2="350" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4,4"/>
                <rect x="100" y="120" width="200" height="180" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="350" y="150" width="140" height="120" fill="none" stroke="currentColor" strokeWidth="1"/>
              </svg>
              {/* Highlight box */}
              <div
                className="absolute border-2 border-red-500 bg-red-500/10 rounded-sm transition-all"
                style={{
                  left: `${(highlightElement.bbox.x / 600) * 100}%`,
                  top: `${(highlightElement.bbox.y / 600) * 100}%`,
                  width: `${Math.max((highlightElement.bbox.w / 600) * 100, 8)}%`,
                  height: `${Math.max((highlightElement.bbox.h / 600) * 100, 3)}%`,
                }}
              >
                <div className="absolute -top-6 left-0 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded whitespace-nowrap">
                  {highlightElement.value} {highlightElement.unit}
                </div>
              </div>
              {/* File info overlay */}
              <div className="absolute bottom-3 left-3 bg-card/90 backdrop-blur-sm border rounded-md px-3 py-2 text-xs">
                <p className="font-medium">ページ {highlightElement.pageNumber}</p>
                <p className="text-muted-foreground">
                  位置: ({highlightElement.bbox.x}, {highlightElement.bbox.y})
                </p>
                <p className="text-muted-foreground">
                  信頼度: {(highlightElement.confidence * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Similar Drawings */}
      {similarDrawings.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-3">類似図面</h3>
          <div className="border rounded-md bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">類似案件</TableHead>
                  <TableHead className="min-w-[180px]">ファイル名</TableHead>
                  <TableHead className="min-w-[70px]">類似度</TableHead>
                  <TableHead className="min-w-[200px]">類似理由</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {similarDrawings.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="text-sm font-medium">
                      {s.similarProjectName}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {s.similarFileName}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-xs rounded ${confidenceColor(
                          s.score
                        )}`}
                      >
                        {(s.score * 100).toFixed(0)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {s.reason}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Similar Specs */}
      {similarSpecs.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-3">類似仕様書</h3>
          <div className="border rounded-md bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[180px]">仕様書</TableHead>
                  <TableHead className="min-w-[130px]">コード</TableHead>
                  <TableHead className="min-w-[70px]">類似度</TableHead>
                  <TableHead className="min-w-[160px]">参考セクション</TableHead>
                  <TableHead className="min-w-[200px]">理由</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {similarSpecs.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="text-sm font-medium">
                      {s.specTitle}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground font-mono">
                      {s.specCode}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-xs rounded ${confidenceColor(
                          s.score
                        )}`}
                      >
                        {(s.score * 100).toFixed(0)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {s.sections.map((sec) => (
                          <Badge key={sec} variant="secondary" className="text-xs">
                            {sec}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {s.reason}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
