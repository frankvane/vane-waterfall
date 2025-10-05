import React, { useMemo } from "react";
import DemoPage from "./_layout/DemoPage";
import { WaterfallCore, withPlugins } from "@/components/WaterfallPlugin";
import { createHeatmapAnalyticsPlugin } from "@/components/WaterfallPlugin/custom-plugins";

interface WaterfallItem { id: number; title: string; color: string; height: number; }

const WaterfallWithPlugins = withPlugins(
  WaterfallCore,
  [createHeatmapAnalyticsPlugin({ showOverlaySummary: true })]
);

export default function HeatmapAnalyticsDemo() {
  const items = useMemo<WaterfallItem[]>(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i + 1,
      title: `项 ${i + 1}`,
      color: `hsl(${(i * 21) % 360}deg 70% 80%)`,
      height: 100 + ((i * 13) % 140),
    }));
  }, []);

  return (
    <DemoPage title="HeatmapAnalytics 插件演示" description="记录曝光与点击，并展示摘要叠层">
      <WaterfallWithPlugins
        items={items}
        columns={4}
        gap={12}
        renderItem={(item) => (
          <div style={{
            background: item.color,
            height: item.height,
            borderRadius: 8,
            padding: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 600,
          }}>
            {item.title}
          </div>
        )}
      />
    </DemoPage>
  );
}