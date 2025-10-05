import React, { useMemo } from "react";
import DemoPage from "./_layout/DemoPage";
import { WaterfallCore, withPlugins } from "@/components/WaterfallPlugin";
import { createClickAnalyticsPlugin } from "@/components/WaterfallPlugin/custom-plugins";

interface Item { id: number; title: string; color: string; height: number; }

const items = Array.from({ length: 80 }, (_, i) => ({
  id: i + 1,
  title: `Item ${i + 1}`,
  color: `hsl(${(i * 37) % 360}, 70%, 85%)`,
  height: 120 + Math.floor(Math.random() * 160),
}));

const WaterfallCompAny = withPlugins<Item>(WaterfallCore, {
  plugins: [createClickAnalyticsPlugin()],
});

export default function ClickAnalyticsDemo() {
  const data = useMemo(() => items, []);
  return (
    <DemoPage title="ClickAnalytics 插件演示" description="点击项会在覆盖层显示累计次数，并通过 bus 发送 analytics:click 事件。">
      <div style={{ height: 600, border: "1px solid #ddd", borderRadius: 8, overflow: "hidden" }}>
        <WaterfallCompAny
          items={data}
          columns={4}
          gap={12}
          containerStyle={{ height: "100%", background: "#f5f5f5", padding: "16px" }}
          renderItem={(item) => (
            <div style={{ background: item.color, height: item.height, borderRadius: 6, padding: "8px 10px", cursor: "pointer" }}>
              <div style={{ fontWeight: 600 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: "#666" }}>点击试试统计</div>
            </div>
          )}
        />
      </div>
    </DemoPage>
  );
}