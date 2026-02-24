"use client";

import { useEffect, useState } from "react";
import { fetchTemplates, fetchRequiredCheckItems } from "@/mock/api";
import { Template, RequiredCheckItem } from "@/mock/data/types";
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
import { Separator } from "@/components/ui/separator";
import { Settings, FileText, CheckSquare, Save } from "lucide-react";

export default function SettingsPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [checkItems, setCheckItems] = useState<RequiredCheckItem[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchTemplates().then(setTemplates);
    fetchRequiredCheckItems().then(setCheckItems);
  }, []);

  const toggleCheckItem = (id: string) => {
    setCheckItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const categories = [...new Set(checkItems.map((c) => c.category))];

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-5 w-5 text-primary" />
        <h1 className="text-xl font-semibold">設定</h1>
      </div>

      {/* Templates */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-base font-medium">仕様書テンプレート</h2>
        </div>
        <div className="border rounded-md bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">テンプレート名</TableHead>
                <TableHead className="min-w-[180px]">説明</TableHead>
                <TableHead className="min-w-[240px]">セクション</TableHead>
                <TableHead className="min-w-[70px]">デフォルト</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="text-sm font-medium">{t.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {t.description}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {t.sections.map((s) => (
                        <Badge key={s} variant="secondary" className="text-xs">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {t.isDefault && (
                      <Badge variant="default" className="text-xs">
                        既定
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <Separator className="mb-8" />

      {/* Required Check Items */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-base font-medium">必須チェック項目</h2>
          </div>
          <Button
            size="sm"
            className="gap-1.5"
            onClick={handleSave}
          >
            <Save className="h-4 w-4" />
            {saved ? "保存しました" : "設定を保存"}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          レビュー時にチェックされる項目を設定します。有効化された項目が仕様書ドラフトに含まれているか自動検証されます。
        </p>

        {categories.map((cat) => (
          <div key={cat} className="mb-4">
            <h3 className="text-sm font-medium mb-2 text-muted-foreground">
              {cat}
            </h3>
            <div className="border rounded-md bg-card">
              <Table>
                <TableBody>
                  {checkItems
                    .filter((c) => c.category === cat)
                    .map((item) => {
                      const sevColor =
                        item.severity === "high"
                          ? "text-red-600"
                          : item.severity === "medium"
                          ? "text-amber-600"
                          : "text-slate-400";
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="w-[40px]">
                            <input
                              type="checkbox"
                              checked={item.enabled}
                              onChange={() => toggleCheckItem(item.id)}
                              className="h-4 w-4 rounded border-input accent-primary cursor-pointer"
                            />
                          </TableCell>
                          <TableCell className="text-sm">{item.label}</TableCell>
                          <TableCell className="w-[80px]">
                            <span className={`text-xs ${sevColor}`}>
                              {item.severity === "high"
                                ? "重要"
                                : item.severity === "medium"
                                ? "推奨"
                                : "任意"}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
