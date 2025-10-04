import React, { useMemo } from "react";

import DemoPage from "./_layout/DemoPage";
import { WaterfallCore } from "@/components/WaterfallPlugin";

interface WaterfallItem {
  id: number;
  title: string;
  color: string;
  height: number;
}

export default function VirtualScrollDemo() {
  // 生成大量数据
  const items = useMemo(() => {
    return Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      title: `Item ${i + 1}`,
      color: `hsl(${(i * 137.5) % 360}, 70%, 80%)`,
      height: Math.floor(Math.random() * 200) + 150,
    }));
  }, []);

  return (
    <DemoPage
      title="虚拟滚动"
      description="启用虚拟滚动，只渲染可见区域的项，大幅提升性能，支持渲染大量数据"
    >
      <div style={{ marginBottom: "16px", color: "#666" }}>
        <p>
          数据量：<strong>{items.length}</strong> 项
        </p>
        <p style={{ fontSize: "14px", marginTop: "8px" }}>
          虚拟滚动模式下，只会渲染可见区域的项，大幅减少 DOM 节点数量，提升性能
        </p>
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
          gap={16}
          virtual={true}
          estimateItemHeight={200}
          overscan={2}
          renderItem={(item: WaterfallItem) => (
            <div
              style={{
                background: item.color,
                height: item.height,
                borderRadius: "8px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "16px",
                color: "#333",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <div>{item.title}</div>
              <div style={{ fontSize: "12px", marginTop: "8px", opacity: 0.7 }}>
                高度: {item.height}px
              </div>
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
