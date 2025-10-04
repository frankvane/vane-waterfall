import React, { useMemo } from "react";
import { WaterfallCore, withPlugins } from "@/components/WaterfallPlugin";
import { createAutoColumnPlugin } from "@/components/WaterfallPlugin/custom-plugins";
import DemoPage from "./_layout/DemoPage";

interface WaterfallItem {
  id: number;
  title: string;
  color: string;
  height: number;
}

const AutoColumnsWaterfall = withPlugins(WaterfallCore, [
  createAutoColumnPlugin({
    minColumnWidth: 200,
    maxColumns: 6,
    minColumns: 1,
  }),
]);

export default function AutoColumnDemo() {
  const items = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i + 1,
      title: `Item ${i + 1}`,
      color: `hsl(${(i * 137.5) % 360}, 70%, 80%)`,
      height: Math.floor(Math.random() * 220) + 120,
    }));
  }, []);

  return (
    <DemoPage
      title="自动列数插件"
      description="根据视口宽度与最小列宽自动计算列数（minColumnWidth / maxColumns）。"
    >
      <div style={{ marginBottom: 12, color: "#666" }}>
        拖动改变窗口宽度，列数会在保证最小列宽的前提下自动变化。
      </div>
      <div
        style={{
          height: "600px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          overflow: "auto",
        }}
      >
        <AutoColumnsWaterfall
          items={items}
          gap={16}
          columnGap={16}
          padding={16}
          containerStyle={{ height: "100%", background: "#f5f5f5" }}
          renderItem={(item: WaterfallItem) => (
            <div
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.currentTarget.click();
                }
              }}
              style={{
                background: item.color,
                height: item.height,
                borderRadius: 8,
                padding: 16,
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {item.title}
            </div>
          )}
          keyExtractor={(item: WaterfallItem) => item.id}
        />
      </div>
    </DemoPage>
  );
}