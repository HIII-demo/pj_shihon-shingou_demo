import { ReviewItem, ReviewComment } from "./types";

export const reviewItems: ReviewItem[] = [
  {
    id: "rev-001",
    projectId: "proj-001",
    draftId: "draft-001",
    sectionId: "sec-002",
    type: "inconsistency",
    severity: "high",
    title: "取付穴ピッチの記載漏れ",
    description:
      "外形図に記載のある取付穴ピッチ（400mm）が仕様書の外形仕様セクションに反映されていません。設置工事に影響する重要寸法です。",
    status: "open",
    assignee: "田中 太郎",
  },
  {
    id: "rev-002",
    projectId: "proj-001",
    draftId: "draft-001",
    sectionId: "sec-003",
    type: "warning",
    severity: "medium",
    title: "使用温度範囲の検証",
    description:
      "使用温度範囲が-20℃〜+60℃と指定されていますが、類似案件（品川駅）では-25℃〜+55℃でした。顧客要件を確認してください。",
    status: "open",
    assignee: "田中 太郎",
  },
  {
    id: "rev-003",
    projectId: "proj-001",
    draftId: "draft-001",
    sectionId: "sec-004",
    type: "suggestion",
    severity: "low",
    title: "PLC型番の世代確認",
    description:
      "Q06UDEHCPUはMELSEC-Qシリーズですが、現在はiQ-Rシリーズへの移行が推奨されています。顧客の保守方針を確認することを推奨します。",
    status: "open",
  },
  {
    id: "rev-004",
    projectId: "proj-001",
    draftId: "draft-001",
    sectionId: "sec-002",
    type: "missing",
    severity: "high",
    title: "接地端子仕様の未記載",
    description:
      "屋外設置盤のため接地端子仕様（D種接地工事対応）の記載が必須ですが、外形仕様セクションに含まれていません。",
    status: "open",
    assignee: "鈴木 一郎",
  },
  {
    id: "rev-005",
    projectId: "proj-001",
    draftId: "draft-001",
    sectionId: "sec-005",
    type: "missing",
    severity: "medium",
    title: "EMC試験要件の追加",
    description:
      "鉄道信号機器として、EMC試験（EN 50121-4準拠）の要件記載が必要です。",
    status: "resolved",
    assignee: "佐藤 花子",
  },
];

export const reviewComments: ReviewComment[] = [
  {
    id: "cmt-001",
    reviewItemId: "rev-001",
    author: "田中 太郎",
    content:
      "確認しました。取付穴ピッチの情報を追加する必要があります。図面上の400mmで問題ないか、設計チームに確認中です。",
    createdAt: "2024-12-20T10:00:00Z",
  },
  {
    id: "cmt-002",
    reviewItemId: "rev-001",
    author: "鈴木 一郎",
    content:
      "設計チーム確認済み。400mmで正式です。アンカーボルトM12×4本の記載も追加してください。",
    createdAt: "2024-12-20T11:30:00Z",
  },
  {
    id: "cmt-003",
    reviewItemId: "rev-002",
    author: "佐藤 花子",
    content:
      "JR東日本の標準仕様書を確認しました。東京駅設置の場合は-20℃〜+60℃で問題ありません。北海道向けの場合のみ-25℃が必要です。",
    createdAt: "2024-12-20T14:00:00Z",
  },
  {
    id: "cmt-004",
    reviewItemId: "rev-005",
    author: "佐藤 花子",
    content:
      "EMC試験要件を追記しました。EN 50121-4の試験項目を第5章に追加済みです。",
    createdAt: "2024-12-19T16:00:00Z",
  },
  {
    id: "cmt-005",
    reviewItemId: "rev-005",
    author: "田中 太郎",
    content: "確認しました。内容問題ありません。解決済みとします。",
    createdAt: "2024-12-19T17:00:00Z",
  },
];
