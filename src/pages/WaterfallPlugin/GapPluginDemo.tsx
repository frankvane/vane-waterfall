import React, { useMemo, useState } from "react";
import { WaterfallCore, createGapPlugin, withPlugins } from "vane-waterfall";

import DemoPage from "./_layout/DemoPage";

interface WaterfallItem {
  id: number;
  title: string;
  color: string;
  height: number;
}

export default function GapPluginDemo() {
  const [rowGap, setRowGap] = useState(12);
  const [columnGap, setColumnGap] = useState(12);

  const items = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      title: `Item ${i + 1}`,
      color: `hsl(${(i * 137.5) % 360}, 70%, 80%)`,
      height: Math.floor(Math.random() * 220) + 120,
    }));
  }, []);

  const Enhanced = useMemo(() => {
    return withPlugins(WaterfallCore, [
      createGapPlugin({ rowGap, columnGap }),
    ]);
  }, [rowGap, columnGap]);

  return (
    <DemoPage
      title="间距插件"
      description="使用 GapPlugin 控制行间距与列间距，可与基础 gap 区分设置。"
    >
      <div style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 8 }}>
            行间距: <strong>{rowGap}px</strong>
          </label>
          <input
            type="range"
            min={0}
            max={40}
            value={rowGap}
            onChange={(e) => setRowGap(Number(e.target.value))}
            style={{ width: 300 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 8 }}>
            列间距: <strong>{columnGap}px</strong>
          </label>
          <input
            type="range"
            min={0}
            max={40}
            value={columnGap}
            onChange={(e) => setColumnGap(Number(e.target.value))}
            style={{ width: 300 }}
          />
        </div>
        <div style={{ marginTop: 4, fontSize: 14, color: "#666" }}>
          两个滑块分别控制行/列间距，观察布局变化。
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
          gap={8}
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