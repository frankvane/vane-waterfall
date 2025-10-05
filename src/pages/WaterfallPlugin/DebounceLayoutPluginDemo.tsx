import React, { useMemo, useRef } from "react";
import DemoPage from "./_layout/DemoPage";
import { WaterfallCore, withPlugins } from "@/components/WaterfallPlugin";
import { createDebounceLayoutPlugin } from "@/components/WaterfallPlugin/custom-plugins";

interface WaterfallItem {
  id: number;
  title: string;
  color: string;
  height: number;
}

const WaterfallWithDebounce = withPlugins(WaterfallCore, [
  createDebounceLayoutPlugin<WaterfallItem>({ delay: 150 }),
]);

export default function DebounceLayoutPluginDemo() {
  // 仅在布局稳定后一条日志：新的完成事件会重置该计时器
  const idleLogTimerRef = useRef<number | null>(null);
  const items = useMemo(() => {
    return Array.from({ length: 90 }, (_, i) => ({
      id: i + 1,
      title: `Debounce Card ${i + 1}`,
      color: `hsl(${(i * 97) % 360}, 70%, 85%)`,
      height: 120 + Math.floor(Math.random() * 200),
    }));
  }, []);

  return (
    <DemoPage title="DebounceLayout 插件演示" description="通过布局防抖延迟减少快速连续变更造成的重复计算。">
      <div style={{ marginBottom: 12, color: "#666" }}>
        提示：演示页仅在“布局稳定”后输出一条日志，用于观察防抖的“尾触发”效果。
      </div>
      <div style={{ width: 960, height: 600, border: "1px solid #ddd", borderRadius: 8, overflow: "hidden" }}>
        <WaterfallWithDebounce
          items={items}
          columns={4}
          gap={12}
          onLayoutComplete={() => {
            // 每次完成都会重置计时器，仅在一段时间无后续完成时打印一次
            if (idleLogTimerRef.current) {
              window.clearTimeout(idleLogTimerRef.current);
            }
            idleLogTimerRef.current = window.setTimeout(() => {
              const now = performance.now();
              console.log(`[DebounceLayout] 布局稳定，尾触发完成 t=${Math.floor(now)}`);
              idleLogTimerRef.current = null;
            }, 300);
          }}
          renderItem={(item) => (
            <div style={{ borderRadius: 6, background: item.color, padding: "10px 12px", height: item.height }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>{item.title}</div>
              <p style={{ margin: 0 }}>窗口缩放或数据变更将按防抖延迟布局。</p>
            </div>
          )}
          containerStyle={{ height: "100%" }}
        />
      </div>
    </DemoPage>
  );
}