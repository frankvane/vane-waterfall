import React, { useMemo, useState } from "react";

import DemoPage from "./_layout/DemoPage";
import { WaterfallCore } from "vane-waterfall";

interface WaterfallItem {
  id: number;
  title: string;
  color: string;
  height: number;
}

export default function ColumnsDemo() {
  const [columns, setColumns] = useState(3);

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
      title="自定义列数"
      description="手动调整列数，查看不同列数下的布局效果"
    >
      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "8px" }}>
          列数: <strong>{columns}</strong>
        </label>
        <input
          type="range"
          min="1"
          max="6"
          value={columns}
          onChange={(e) => setColumns(Number(e.target.value))}
          style={{ width: "300px" }}
        />
        <div style={{ marginTop: "8px", fontSize: "14px", color: "#666" }}>
          拖动滑块调整列数（1-6）
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
          columns={columns}
          gap={16}
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
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.currentTarget.click();
                }
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
