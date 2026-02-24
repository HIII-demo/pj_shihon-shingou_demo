import { SimilarDrawing, SimilarSpec } from "./types";

export const similarDrawings: SimilarDrawing[] = [
  {
    id: "sim-d-001",
    projectId: "proj-001",
    similarProjectId: "proj-004",
    similarProjectName: "名古屋駅 ホームドア制御盤 増設",
    similarFileName: "ホームドア制御盤_外形図_Rev3.pdf",
    score: 0.87,
    reason:
      "同系列のSUS304製制御盤。外形寸法・防水規格（IP54）が類似。盤体構造が共通設計ベース。",
  },
  {
    id: "sim-d-002",
    projectId: "proj-001",
    similarProjectId: "proj-legacy-01",
    similarProjectName: "品川駅 信号制御盤 更新（2023年）",
    similarFileName: "信号制御盤_外形図_Rev4.pdf",
    score: 0.82,
    reason:
      "同一顧客の前回案件。PLC型番・リレー構成が類似。回路構成の80%が共通。",
  },
  {
    id: "sim-d-003",
    projectId: "proj-001",
    similarProjectId: "proj-legacy-02",
    similarProjectName: "渋谷駅 信号制御盤 改修（2022年）",
    similarFileName: "制御盤_回路図.pdf",
    score: 0.74,
    reason:
      "回路構成が類似。使用部品の60%が共通だが、PLC世代が異なる。",
  },
  {
    id: "sim-d-004",
    projectId: "proj-002",
    similarProjectId: "proj-legacy-03",
    similarProjectName: "東京駅 旅客案内表示器 更新（2023年）",
    similarFileName: "案内表示器_外形図.pdf",
    score: 0.91,
    reason:
      "同シリーズの表示器。筐体構造・LEDモジュール配置が同一設計ベース。サイズ違い。",
  },
  {
    id: "sim-d-005",
    projectId: "proj-002",
    similarProjectId: "proj-legacy-04",
    similarProjectName: "博多駅 案内表示器 新設（2023年）",
    similarFileName: "LED案内板_詳細図.pdf",
    score: 0.78,
    reason:
      "LEDモジュール仕様と制御基板が同一型番。筐体材質・サイズが異なる。",
  },
];

export const similarSpecs: SimilarSpec[] = [
  {
    id: "sim-s-001",
    projectId: "proj-001",
    specTitle: "品川駅 信号制御盤 仕様書",
    specCode: "SG-2023-SPEC-0098",
    score: 0.89,
    reason:
      "同型制御盤の仕様書。環境条件・試験項目が90%共通。防水規格が同一。",
    sections: ["3. 環境条件", "5. 試験要件", "6. 品質保証"],
  },
  {
    id: "sim-s-002",
    projectId: "proj-001",
    specTitle: "渋谷駅 信号制御盤 仕様書",
    specCode: "SB-2022-SPEC-0045",
    score: 0.75,
    reason:
      "PLC制御部の仕様が類似。ただし通信プロトコルが旧世代。",
    sections: ["4. 機能仕様", "4.2 PLC制御"],
  },
  {
    id: "sim-s-003",
    projectId: "proj-002",
    specTitle: "東京駅 旅客案内表示器 仕様書",
    specCode: "TK-2023-SPEC-0156",
    score: 0.92,
    reason:
      "同シリーズ表示器の仕様書。表示仕様・通信仕様がほぼ同一。",
    sections: ["2. 外形仕様", "4. 表示仕様", "5. 通信仕様"],
  },
];
