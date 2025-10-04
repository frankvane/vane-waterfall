import React, { useMemo } from "react";
import { WaterfallCore, withPlugins } from "@/components/WaterfallPlugin";

import DemoPage from "./_layout/DemoPage";
import { createResponsiveColumnsPlugin } from "@/components/WaterfallPlugin/custom-plugins";

interface WaterfallItem {
  id: number;
  title: string;
  color: string;
  height: number;
}

const ResponsiveWaterfall = withPlugins(WaterfallCore, [
  createResponsiveColumnsPlugin({
    breakpoints: {
      xs: { width: 0, columns: 1 },
      sm: { width: 640, columns: 2 },
      md: { width: 768, columns: 3 },
      lg: { width: 1024, columns: 4 },
      xl: { width: 1280, columns: 5 },
    },
  }),
]);

export default function ResponsiveColumnsDemo() {
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
      title="响应式列数插件"
      description="根据视口宽度在预设断点上自动调整列数（sm/md/lg/xl）。"
    >
      <div style={{ marginBottom: 12, color: "#666" }}>
        拖动改变窗口宽度，列数会在断点处自动变化。
      </div>
      <div
        style={{
          height: "600px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <ResponsiveWaterfall
          items={items}
          gap={16}
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
