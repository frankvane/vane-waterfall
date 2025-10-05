import React, { useEffect, useRef, useState } from "react";
import { WaterfallCore, withPlugins } from "@/components/WaterfallPlugin";

import DemoPage from "./_layout/DemoPage";
import type { WaterfallCoreRef } from "@/components/WaterfallPlugin";
import { createDragReorderPlugin } from "@/components/WaterfallPlugin/custom-plugins";

interface Item { id: number; title: string; color: string; height: number; }

const items = Array.from({ length: 60 }, (_, i) => ({
  id: i + 1,
  title: `Item ${i + 1}`,
  color: `hsl(${(i * 29) % 360}, 70%, 86%)`,
  height: 120 + Math.floor(Math.random() * 160),
}));

const WaterfallCompAny = withPlugins<Item>(WaterfallCore, {
  plugins: [createDragReorderPlugin<Item>()],
});

export default function DragReorderDemo() {
  const [data, setData] = useState(items);
  const ref = useRef<WaterfallCoreRef>(null);
  const [lastReorder, setLastReorder] = useState<string>("尚未发生拖拽");

  // 订阅插件总线的拖拽事件，显示操作结果
  useEffect(() => {
    const container = ref.current?.getContainer?.();
    if (!container) return;
    // 使用全局事件桥：插件通过 bus.emit，HOC 未暴露 bus，这里用 window 事件占位模拟
    const handler = (e: any) => {
      const { from, to } = e.detail || {};
      if (typeof from === "number" && typeof to === "number") {
        setLastReorder(`拖拽：${from + 1} → ${to + 1}`);
        // 执行数据重排
        setData((prev) => {
          if (from === to || from < 0 || to < 0 || from >= prev.length || to >= prev.length) return prev;
          const next = prev.slice();
          const [moved] = next.splice(from, 1);
          next.splice(to, 0, moved);
          return next;
        });
        // 可选：触发布局重算
        ref.current?.relayout?.();
      }
    };
    window.addEventListener("waterfall:drag-reorder", handler as any);
    return () => window.removeEventListener("waterfall:drag-reorder", handler as any);
  }, []);
  return (
    <DemoPage title="DragReorder 插件演示" description="按住卡片进行拖拽以查看事件输出（不变更数据）。">
      <div style={{ marginBottom: 8, display: "flex", gap: 8, alignItems: "center" }}>
        <span style={{ color: "#555" }}>最近操作：</span>
        <span style={{ color: "#888" }}>{lastReorder}</span>
      </div>
      <div style={{ height: 600, border: "1px solid #ddd", borderRadius: 8, overflow: "hidden" }}>
        <WaterfallCompAny
          ref={ref}
          items={data}
          columns={4}
          gap={12}
          keyExtractor={(item) => item.id}
          containerStyle={{ height: "100%", background: "#f5f5f5", padding: "16px", overflow: "auto" }}
          renderItem={(item) => (
            <div style={{ background: item.color, height: item.height, borderRadius: 6, padding: "8px 10px", cursor: "grab" }} draggable>
              <div style={{ fontWeight: 600 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: "#666" }}>提示：按住卡片进行拖拽</div>
            </div>
          )}
        />
      </div>
      <p style={{ marginTop: 12, color: "#666" }}>
        说明：示例页已响应事件并更新数据源（前端内存重排）。如需持久化，请将新顺序同步到后端或状态管理。
      </p>
    </DemoPage>
  );
}