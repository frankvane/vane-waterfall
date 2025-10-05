import React, { useMemo } from "react";
import DemoPage from "./_layout/DemoPage";
import { WaterfallCore, withPlugins } from "@/components/WaterfallPlugin";
import { createThrottlePlugin } from "@/components/WaterfallPlugin/custom-plugins";

interface WaterfallItem {
  id: number;
  title: string;
  color: string;
  height: number;
}

const WaterfallWithThrottle = withPlugins(WaterfallCore, [
  createThrottlePlugin<WaterfallItem>({ scroll: 100, resize: 200 }),
]);

export default function ThrottlePluginDemo() {
  const items = useMemo(() => {
    return Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      title: `Throttle Card ${i + 1}`,
      color: `hsl(${(i * 97) % 360}, 70%, 85%)`,
      height: 120 + Math.floor(Math.random() * 200),
    }));
  }, []);

  return (
    <DemoPage title="Throttle 插件演示" description="为滚动与尺寸变化设置节流/防抖延迟，降低高频事件压力。">
      <div style={{ width: 960, height: 600, border: "1px solid #ddd", borderRadius: 8, overflow: "hidden" }}>
        <WaterfallWithThrottle
          items={items}
          columns={4}
          gap={12}
          onScroll={(top) => {
            // 直观验证：打印节流后的滚动事件频率与时间戳
            console.log(`[Throttle] onScroll top=${top} t=${Math.floor(performance.now())}`);
          }}
          onResize={(w, h) => {
            console.log(`[Throttle] onResize w=${w} h=${h} t=${Math.floor(performance.now())}`);
          }}
          renderItem={(item) => (
            <div style={{ borderRadius: 6, background: item.color, padding: "10px 12px", height: item.height }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>{item.title}</div>
              <p style={{ margin: 0 }}>滚动/窗口变更将按设置的延迟处理。</p>
            </div>
          )}
          containerStyle={{ height: "100%" }}
        />
      </div>
    </DemoPage>
  );
}