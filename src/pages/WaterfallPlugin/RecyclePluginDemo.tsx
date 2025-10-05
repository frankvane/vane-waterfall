import React, { useMemo, useRef, useState } from "react";
import { WaterfallCore, createRecyclePlugin, withPlugins } from "vane-waterfall";

import DemoPage from "./_layout/DemoPage";

interface WaterfallItem {
  id: number;
  title: string;
  color: string;
  height: number;
}

const WaterfallWithRecycle = withPlugins(WaterfallCore, [
  createRecyclePlugin<WaterfallItem>({ poolSize: 50 }),
]);

export default function RecyclePluginDemo() {
  const [highlight, setHighlight] = useState(true);
  const [visibleCount, setVisibleCount] = useState(0);
  const [logEnabled, setLogEnabled] = useState(false);
  const visibleSetRef = useRef<Set<number>>(new Set());

  const items = useMemo(() => {
    return Array.from({ length: 150 }, (_, i) => ({
      id: i + 1,
      title: `Recycle Card ${i + 1}`,
      color: `hsl(${(i * 97) % 360}, 70%, 85%)`,
      height: 100 + Math.floor(Math.random() * 220),
    }));
  }, []);

  return (
    <DemoPage title="Recycle 插件演示" description="视口外项隐藏以降低绘制压力，近似回收复用。">
      <div style={{ width: 960, height: 600, border: "1px solid #ddd", borderRadius: 8, overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", top: 8, right: 8, zIndex: 2, display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ padding: "6px 8px", background: "#f1f8e9", border: "1px solid #c5e1a5", borderRadius: 6, color: "#33691e" }}>
            可见项：{visibleCount}
          </span>
          <label style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#666" }}>
            <input type="checkbox" checked={highlight} onChange={(e) => setHighlight(e.target.checked)} />
            高亮可见项
          </label>
          <label style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#666" }}>
            <input type="checkbox" checked={logEnabled} onChange={(e) => setLogEnabled(e.target.checked)} />
            控制台日志
          </label>
        </div>
        <WaterfallWithRecycle
          items={items}
          columns={4}
          gap={12}
          onItemEnterViewport={(index) => {
            visibleSetRef.current.add(index);
            setVisibleCount(visibleSetRef.current.size);
            if (logEnabled) console.log(`[Recycle] 进入视口: #${index}`);
          }}
          onItemLeaveViewport={(index) => {
            visibleSetRef.current.delete(index);
            setVisibleCount(visibleSetRef.current.size);
            if (logEnabled) console.log(`[Recycle] 离开视口: #${index}`);
          }}
          renderItem={(item, idx) => {
            const isVisible = visibleSetRef.current.has(idx);
            return (
              <div
                style={{
                  borderRadius: 6,
                  background: item.color,
                  padding: "10px 12px",
                  height: item.height,
                  boxShadow: highlight && isVisible ? "0 0 0 2px #ff9800 inset" : "none",
                  transition: "box-shadow 120ms ease",
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: 8 }}>{item.title}</div>
                <p style={{ margin: 0 }}>离开视口的项会被隐藏，从而节省绘制。</p>
              </div>
            );
          }}
          containerStyle={{ height: "100%" }}
        />
      </div>
    </DemoPage>
  );
}