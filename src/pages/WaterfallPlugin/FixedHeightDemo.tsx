import React, { useMemo, useState } from "react";
import { WaterfallCore, withPlugins } from "@/components/WaterfallPlugin";
import { createFixedHeightPlugin } from "@/components/WaterfallPlugin/custom-plugins";
import DemoPage from "./_layout/DemoPage";

interface WaterfallItem {
  id: number;
  title: string;
  color: string;
  height: number;
}

export default function FixedHeightDemo() {
  const [itemHeight, setItemHeight] = useState(160);

  const items = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      title: `Item ${i + 1}`,
      color: `hsl(${(i * 137.5) % 360}, 70%, 80%)`,
      // 原始高度仅用于演示对比，插件会统一覆盖为 itemHeight
      height: Math.floor(Math.random() * 220) + 120,
    }));
  }, []);

  const Enhanced = useMemo(() => {
    return withPlugins(WaterfallCore, [createFixedHeightPlugin({ itemHeight })]);
  }, [itemHeight]);

  return (
    <DemoPage
      title="固定高度插件"
      description="使用 FixedHeightPlugin 将所有项高度统一为固定值，呈现更整齐的网格风格。"
    >
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 8 }}>
          项高度: <strong>{itemHeight}px</strong>
        </label>
        <input
          type="range"
          min={80}
          max={260}
          value={itemHeight}
          onChange={(e) => setItemHeight(Number(e.target.value))}
          style={{ width: 300 }}
        />
        <div style={{ marginTop: 8, fontSize: 14, color: "#666" }}>
          调整滑块观察所有卡片高度的统一变化。
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
              <div style={{ fontSize: 12, color: "#333" }}>原始 h: {item.height}</div>
            </div>
          )}
        />
      </div>
    </DemoPage>
  );
}