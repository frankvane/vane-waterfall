import React, { useMemo } from "react";
import { WaterfallCore, createPinItemPlugin, withPlugins } from "vane-waterfall";

import DemoPage from "./_layout/DemoPage";

interface WaterfallItem { id: number; title: string; color: string; height: number; }

// 将第 2、5、8 项固定到第 0 列顶部
const WaterfallWithPlugins = withPlugins(
  WaterfallCore,
  [createPinItemPlugin({ pinnedIndices: [1, 4, 7], column: 0 })]
);

export default function PinItemDemo() {
  const items = useMemo<WaterfallItem[]>(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i + 1,
      title: `项 ${i + 1}`,
      color: `hsl(${(i * 33) % 360}deg 70% 80%)`,
      height: 90 + ((i * 17) % 120),
    }));
  }, []);

  return (
    <DemoPage title="PinItem 插件演示" description="将若干项固定在顶部的某列">
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