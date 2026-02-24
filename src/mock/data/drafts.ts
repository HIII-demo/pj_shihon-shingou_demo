import { SpecDraft, DraftSection } from "./types";

const proj001Sections: DraftSection[] = [
  {
    id: "sec-001",
    draftId: "draft-001",
    sectionNumber: "1",
    title: "概要",
    content: `## 1. 概要

### 1.1 目的
本仕様書は、東京駅北口に設置する信号制御盤の改修に関する技術仕様を定めるものである。

### 1.2 適用範囲
本仕様書は、以下の機器に適用する。
- 信号制御盤本体（屋外設置型）
- 付属する制御機器・配線材料

### 1.3 適用規格
- JIS C 0920（電気機械器具の外郭による保護等級）
- JIS E 3013（鉄道信号保安装置の試験方法）
- 日本信号社内規格 NS-STD-2024`,
    sourceElements: [],
    status: "approved",
  },
  {
    id: "sec-002",
    draftId: "draft-001",
    sectionNumber: "2",
    title: "外形仕様",
    content: `## 2. 外形仕様

### 2.1 外形寸法
| 項目 | 仕様 |
|------|------|
| 幅 | 800 mm |
| 高さ | 2100 mm |
| 奥行 | 500 mm |
| 質量 | 約 180 kg |

### 2.2 材質・仕上げ
| 項目 | 仕様 |
|------|------|
| 盤体材質 | SUS304（板厚 2.3 mm） |
| 表面処理 | メラミン焼付塗装 |
| 塗装色 | マンセル 5Y7/1 |

### 2.3 保護等級
- 防水・防塵規格: IP54
- 使用温度範囲: -20℃〜+60℃`,
    sourceElements: ["elem-001", "elem-002", "elem-003", "elem-005", "elem-006", "elem-008", "elem-009", "elem-015"],
    status: "edited",
  },
  {
    id: "sec-003",
    draftId: "draft-001",
    sectionNumber: "3",
    title: "環境条件",
    content: `## 3. 環境条件

### 3.1 設置環境
- 設置場所: 屋外（軌道脇）
- 使用温度範囲: -20℃〜+60℃
- 使用湿度範囲: 30%〜95%RH（結露なきこと）

### 3.2 耐環境性能
- 耐振動: JIS E 3013 準拠
- 耐衝撃: 前後左右 10G
- 耐塩害: 塩水噴霧試験 96時間`,
    sourceElements: ["elem-010"],
    status: "auto",
  },
  {
    id: "sec-004",
    draftId: "draft-001",
    sectionNumber: "4",
    title: "機能仕様",
    content: `## 4. 機能仕様

### 4.1 制御機能
- PLC制御: Q06UDEHCPU による信号制御
- リレー回路: MY4N-D2 DC24V × 24 回路
- 電源: AC100V → DC24V 変換（冗長構成）

### 4.2 通信機能
- 上位通信: Ethernet（TCP/IP）
- フィールド通信: CC-Link Ver.2
- 監視通信: RS-485（MODBUS RTU）

### 4.3 安全機能
- ウォッチドグタイマ: 200ms
- 自己診断: 電源投入時・定周期（1分毎）
- フェイルセーフ: 全信号停止側制御`,
    sourceElements: ["elem-011", "elem-012"],
    status: "auto",
  },
  {
    id: "sec-005",
    draftId: "draft-001",
    sectionNumber: "5",
    title: "試験要件",
    content: `## 5. 試験要件

### 5.1 工場試験
| No. | 試験項目 | 試験方法 | 判定基準 |
|-----|----------|----------|----------|
| 1 | 絶縁抵抗試験 | DC500V メガー | 10MΩ以上 |
| 2 | 耐電圧試験 | AC1500V 1分間 | 異常なきこと |
| 3 | 動作試験 | 全回路動作確認 | 仕様通り動作 |
| 4 | 防水試験 | IP54準拠 | 浸水なきこと |

### 5.2 現地試験
- 設置後動作試験
- 通信接続試験
- 連動試験`,
    sourceElements: ["elem-008", "elem-014"],
    status: "auto",
  },
];

export const drafts: SpecDraft[] = [
  {
    id: "draft-001",
    projectId: "proj-001",
    templateId: "tmpl-001",
    templateName: "制御盤仕様書テンプレート",
    version: 1,
    status: "review",
    createdAt: "2024-12-18T10:00:00Z",
    updatedAt: "2024-12-20T14:30:00Z",
    sections: proj001Sections,
  },
];
