import React, { useMemo } from "react";
import { WaterfallCore, withPlugins } from "@/components/WaterfallPlugin";
import { createGroupingPlugin, createStickyHeaderPlugin } from "@/components/WaterfallPlugin/custom-plugins";

import DemoPage from "./_layout/DemoPage";

interface Item { id: number; title: string; category: "A" | "B" | "C"; color: string; height: number; }

const items = Array.from({ length: 90 }, (_, i) => ({
  id: i + 1,
  title: `Item ${i + 1}`,
  category: ((types => types[i % types.length])(["A", "B", "C"])) as Item["category"],
  color: `hsl(${(i * 33) % 360}, 70%, 86%)`,
  height: 120 + Math.floor(Math.random() * 160),
}));

const WaterfallCompAny = withPlugins<Item>(WaterfallCore, {
  plugins: [
    createGroupingPlugin<Item>({ groupBy: (it) => it.category }),
    createStickyHeaderPlugin({ title: "当前分组" }),
  ],
});

export default function StickyHeaderDemo() {
  const data = useMemo(() => items, []);
  return (
    <DemoPage title="StickyHeader 插件演示" description="滚动时可见吸顶标题。">
      <div style={{ height: 600, border: "1px solid #ddd", borderRadius: 8, overflow: "hidden" }}>
        <WaterfallCompAny
          items={data}
          columns={4}
          gap={12}
          containerStyle={{ height: "100%", background: "#f5f5f5", padding: "16px", overflow: "auto" }}
          renderItem={(item) => (
            <div style={{ background: item.color, height: item.height, borderRadius: 6, padding: "8px 10px" }}>
              <div style={{ fontWeight: 600 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: "#666" }}>分组：{item.category}</div>
            </div>
          )}
        />
      </div>
    </DemoPage>
  );
}