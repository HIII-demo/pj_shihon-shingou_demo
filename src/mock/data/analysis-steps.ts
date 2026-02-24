import { AnalysisStep } from "./types";

export const analysisSteps: AnalysisStep[] = [
  {
    id: "step-1",
    label: "OCR処理",
    description: "図面からテキスト・数値情報を読み取り中...",
    duration: 2500,
  },
  {
    id: "step-2",
    label: "構造解析",
    description: "図面のレイアウト・表題欄・注記欄を構造化中...",
    duration: 3000,
  },
  {
    id: "step-3",
    label: "要素抽出",
    description: "寸法・材料・部品情報・注記を抽出中...",
    duration: 3500,
  },
  {
    id: "step-4",
    label: "信頼度算出",
    description: "各抽出要素の信頼度スコアを算出中...",
    duration: 2000,
  },
  {
    id: "step-5",
    label: "類似検索",
    description: "過去の図面・仕様書との類似度を計算中...",
    duration: 2500,
  },
];

export const generationSteps: AnalysisStep[] = [
  {
    id: "gen-1",
    label: "テンプレート読込",
    description: "仕様書テンプレートを読み込み中...",
    duration: 1000,
  },
  {
    id: "gen-2",
    label: "要素マッピング",
    description: "抽出要素をテンプレートセクションにマッピング中...",
    duration: 2000,
  },
  {
    id: "gen-3",
    label: "セクション生成",
    description: "各セクションの文章を生成中...",
    duration: 4000,
  },
  {
    id: "gen-4",
    label: "整合性チェック",
    description: "セクション間の整合性を検証中...",
    duration: 2500,
  },
  {
    id: "gen-5",
    label: "レビュー項目生成",
    description: "要チェック項目を自動検出中...",
    duration: 2000,
  },
];
