import React, { useMemo, useState } from "react";

import DemoPage from "./_layout/DemoPage";
import { WaterfallCore } from "vane-waterfall";

interface WaterfallItem {
  id: number;
  title: string;
  color: string;
  height: number;
}

export default function CustomGapDemo() {
  const [gap, setGap] = useState(16);
  const [rowGap, setRowGap] = useState(16);
  const [columnGap, setColumnGap] = useState(16);

  const items = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      title: `Item ${i + 1}`,
      color: `hsl(${(i * 137.5) % 360}, 70%, 80%)`,
      height: Math.floor(Math.random() * 200) + 150,
    }));
  }, []);

  return (
    <DemoPage
      title="自定义间距"
      description="自定义行间距和列间距，支持统一间距或分别设置"
    >
      <div style={{ marginBottom: "16px" }}>
        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>
            统一间距: {gap}px
          </label>
          <input
            type="range"
            min="0"
            max="50"
            value={gap}
            onChange={(e) => {
              const value = Number(e.target.value);
              setGap(value);
              setRowGap(value);
              setColumnGap(value);
            }}
            style={{ width: "300px" }}
          />
        </div>
        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>
            行间距: {rowGap}px
          </label>
          <input
            type="range"
            min="0"
            max="50"
            value={rowGap}
            onChange={(e) => setRowGap(Number(e.target.value))}
            style={{ width: "300px" }}
          />
        </div>
        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>
            列间距: {columnGap}px
          </label>
          <input
            type="range"
            min="0"
            max="50"
            value={columnGap}
            onChange={(e) => setColumnGap(Number(e.target.value))}
            style={{ width: "300px" }}
          />
        </div>
      </div>

      <div
        style={{
          height: "600px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <WaterfallCore
          items={items}
          columns={3}
          rowGap={rowGap}
          columnGap={columnGap}
          renderItem={(item: WaterfallItem) => (
            <div
              style={{
                background: item.color,
                height: item.height,
                borderRadius: "8px",
                padding: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "18px",
                color: "#333",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              {item.title}
            </div>
          )}
          keyExtractor={(item: WaterfallItem) => item.id}
          containerStyle={{
            height: "100%",
            background: "#f5f5f5",
            padding: "16px",
          }}
        />
      </div>
    </DemoPage>
  );
}
