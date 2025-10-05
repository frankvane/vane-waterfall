import React, { useMemo } from "react";
import DemoPage from "./_layout/DemoPage";
import { WaterfallCore, withPlugins } from "@/components/WaterfallPlugin";
import { createTransitionPlugin } from "@/components/WaterfallPlugin/custom-plugins";

interface WaterfallItem { id: number; title: string; color: string; height: number; }

const WaterfallWithPlugins = withPlugins(WaterfallCore, [createTransitionPlugin({ duration: 400 })]);

export default function TransitionDemo() {
  const items = useMemo<WaterfallItem[]>(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i + 1,
      title: `项 ${i + 1}`,
      color: `hsl(${(i * 29) % 360}deg 70% 80%)`,
      height: 120 + ((i * 41) % 120),
    }));
  }, []);

  return (
    <DemoPage title="Transition 插件演示" description="为布局变化提供平滑过渡">
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