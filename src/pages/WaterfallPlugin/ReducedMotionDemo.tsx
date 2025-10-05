import React, { useMemo } from "react";
import { WaterfallCore, createReducedMotionPlugin, withPlugins } from "vane-waterfall";

import DemoPage from "./_layout/DemoPage";

interface WaterfallItem { id: number; title: string; color: string; height: number; }

const WaterfallWithPlugins = withPlugins(WaterfallCore, [createReducedMotionPlugin()]);

export default function ReducedMotionDemo() {
  const items = useMemo<WaterfallItem[]>(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i + 1,
      title: `项 ${i + 1}`,
      color: `hsl(${(i * 23) % 360}deg 70% 80%)`,
      height: 100 + ((i * 19) % 120),
    }));
  }, []);

  return (
    <DemoPage title="ReducedMotion 插件演示" description="尊重系统偏好，减少动画与过渡">
      <WaterfallWithPlugins
        items={items}
        columns={3}
        gap={16}
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