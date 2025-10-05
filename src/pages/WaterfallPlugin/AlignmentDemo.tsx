import React, { useMemo, useState } from "react";
import { WaterfallCore, createAlignmentPlugin, withPlugins } from "vane-waterfall";

import DemoPage from "./_layout/DemoPage";

interface WaterfallItem {
  id: number;
  title: string;
  color: string;
  height: number;
}

export default function AlignmentDemo() {
  const [mode, setMode] = useState<"shortest" | "balanced" | "sequential">(
    "shortest"
  );

  const items = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      title: `Item ${i + 1}`,
      color: `hsl(${(i * 137.5) % 360}, 70%, 80%)`,
      height: Math.floor(Math.random() * 220) + 120,
    }));
  }, []);

  const Enhanced = useMemo(() => {
    return withPlugins(WaterfallCore, [createAlignmentPlugin({ mode })]);
  }, [mode]);

  return (
    <DemoPage
      title="对齐策略插件"
      description="通过 AlignmentPlugin 控制列分配策略：最矮列（shortest）、顺序分配（sequential）、均衡项数（balanced）。"
    >
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <strong>模式：</strong>
          <button
            onClick={() => setMode("shortest")}
            style={{
              padding: "6px 10px",
              borderRadius: 4,
              border: "1px solid #ccc",
              background: mode === "shortest" ? "#e9f5ff" : "#fff",
            }}
          >
            shortest（默认）
          </button>
          <button
            onClick={() => setMode("sequential")}
            style={{
              padding: "6px 10px",
              borderRadius: 4,
              border: "1px solid #ccc",
              background: mode === "sequential" ? "#e9f5ff" : "#fff",
            }}
          >
            sequential（顺序）
          </button>
          <button
            onClick={() => setMode("balanced")}
            style={{
              padding: "6px 10px",
              borderRadius: 4,
              border: "1px solid #ccc",
              background: mode === "balanced" ? "#e9f5ff" : "#fff",
            }}
          >
            balanced（均衡项数）
          </button>
        </div>
        <div style={{ marginTop: 8, fontSize: 14, color: "#666" }}>
          切换不同策略观察项在各列的分配差异。
        </div>
      </div>

      <div
        style={{
          height: "600px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          overflow: "auto",
        }}
      >
        <Enhanced
          items={items}
          columns={4}
          gap={12}
          renderItem={(item: WaterfallItem) => (
            <div
              style={{
                background: item.color,
                height: item.height,
                borderRadius: 6,
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                padding: 8,
                boxSizing: "border-box",
              }}
            >
              <div style={{ fontWeight: 600 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: "#333" }}>h: {item.height}</div>
            </div>
          )}
        />
      </div>
    </DemoPage>
  );
}