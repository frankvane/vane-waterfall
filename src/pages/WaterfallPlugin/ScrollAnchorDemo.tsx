import React, { useMemo, useRef, useState } from "react";
import DemoPage from "./_layout/DemoPage";
import { WaterfallCore, withPlugins } from "@/components/WaterfallPlugin";
import type { WaterfallCoreRef } from "@/components/WaterfallPlugin";
import { createScrollAnchorPlugin } from "@/components/WaterfallPlugin/custom-plugins";

interface Item { id: number | string; title: string; color: string; height: number; }

const items = Array.from({ length: 80 }, (_, i) => ({
  id: `ID-${i + 1}`,
  title: `Item ${i + 1}`,
  color: `hsl(${(i * 37) % 360}, 70%, 85%)`,
  height: 120 + Math.floor(Math.random() * 160),
}));

const WaterfallCompAny = withPlugins<Item>(WaterfallCore, {
  plugins: [createScrollAnchorPlugin<Item>({ getAnchorId: (it) => it.id })],
});

export default function ScrollAnchorDemo() {
  const data = useMemo(() => items, []);
  const ref = useRef<WaterfallCoreRef>(null);
  const [lastAction, setLastAction] = useState<string>("");
  const scrollToAnchor = (anchor: string) => {
    const index = data.findIndex((it) => String(it.id) === anchor);
    if (index >= 0) {
      ref.current?.scrollToItem(index, { behavior: "smooth", block: "start" });
      setLastAction(`已跳转到 ${anchor}`);
    } else {
      setLastAction(`未找到锚点 ${anchor}`);
    }
  };
  return (
    <DemoPage title="ScrollAnchor 插件演示" description="覆盖层提供锚点按钮；也可使用下方快捷按钮跳转到指定锚点。">
      <div style={{ marginBottom: 8, display: "flex", gap: 8, alignItems: "center" }}>
        <span style={{ color: "#555" }}>快捷跳转：</span>
        {[
          "ID-10",
          "ID-20",
          "ID-40",
          "ID-60",
        ].map((id) => (
          <button key={id} onClick={() => scrollToAnchor(id)} style={{ padding: "6px 10px", borderRadius: 6 }}>
            {id}
          </button>
        ))}
        <span style={{ marginLeft: 12, color: "#888" }}>{lastAction}</span>
      </div>
      <div style={{ height: 600, border: "1px solid #ddd", borderRadius: 8, overflow: "hidden" }}>
        <WaterfallCompAny
          ref={ref}
          items={data}
          columns={4}
          gap={12}
          containerStyle={{ height: "100%", background: "#f5f5f5", padding: "16px", overflow: "auto" }}
          renderItem={(item) => (
            <div style={{ background: item.color, height: item.height, borderRadius: 6, padding: "8px 10px" }}>
              <div style={{ fontWeight: 600 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: "#666" }}>锚点：{String(item.id)}</div>
            </div>
          )}
        />
      </div>
    </DemoPage>
  );
}