import React, { useMemo, useRef, useState } from "react";
import { WaterfallCore, WaterfallCoreRef } from "@/components/WaterfallPlugin";

import DemoPage from "./_layout/DemoPage";

interface WaterfallItem {
  id: number;
  title: string;
  color: string;
  height: number;
}

export default function RefMethodsDemo() {
  const waterfallRef = useRef<WaterfallCoreRef>(null);
  const [targetIndex, setTargetIndex] = useState(15);
  const [layoutInfo, setLayoutInfo] = useState<string>("");
  const [visibleInfo, setVisibleInfo] = useState<string>("");

  const items = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      title: `Item ${i + 1}`,
      color: `hsl(${(i * 137.5) % 360}, 70%, 80%)`,
      height: Math.floor(Math.random() * 200) + 150,
    }));
  }, []);

  // 滚动到指定项
  const handleScrollToItem = () => {
    waterfallRef.current?.scrollToItem(targetIndex, {
      behavior: "smooth",
      block: "center",
    });
  };

  // 滚动到顶部
  const handleScrollToTop = () => {
    waterfallRef.current?.scrollToTop({ behavior: "smooth" });
  };

  // 滚动到底部
  const handleScrollToBottom = () => {
    waterfallRef.current?.scrollToBottom({ behavior: "smooth" });
  };

  // 获取布局信息
  const handleGetLayoutInfo = () => {
    const info = waterfallRef.current?.getLayoutInfo();
    if (info) {
      setLayoutInfo(
        `列数: ${info.columns}, 列宽: ${info.columnWidth.toFixed(
          2
        )}px, 总高度: ${info.totalHeight.toFixed(2)}px`
      );
    }
  };

  // 获取可见项
  const handleGetVisibleItems = () => {
    const visible = waterfallRef.current?.getVisibleItems();
    if (visible) {
      const indices = Array.from(visible).sort((a, b) => a - b);
      setVisibleInfo(
        `可见项: ${indices.length} 个 (索引: ${indices
          .slice(0, 10)
          .join(", ")}${indices.length > 10 ? "..." : ""})`
      );
    }
  };

  // 重新布局
  const handleRelayout = () => {
    waterfallRef.current?.relayout();
    alert("已触发重新布局");
  };

  // 获取项位置
  const handleGetItemPosition = () => {
    const position = waterfallRef.current?.getItemPosition(targetIndex);
    if (position) {
      alert(
        `Item ${targetIndex} 位置:\n` +
          `X: ${position.x.toFixed(2)}px\n` +
          `Y: ${position.y.toFixed(2)}px\n` +
          `宽: ${position.width.toFixed(2)}px\n` +
          `高: ${position.height.toFixed(2)}px\n` +
          `列: ${position.column}`
      );
    }
  };

  return (
    <DemoPage
      title="Ref 方法调用"
      description="演示通过 ref 调用组件方法，实现滚动控制、获取布局信息等功能"
    >
      <div style={{ marginBottom: "16px" }}>
        <h3 style={{ marginBottom: "12px", fontSize: "1.1em" }}>📍 滚动控制</h3>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            marginBottom: "12px",
          }}
        >
          <button
            onClick={handleScrollToTop}
            style={{
              padding: "8px 16px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            滚动到顶部
          </button>
          <button
            onClick={handleScrollToBottom}
            style={{
              padding: "8px 16px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            滚动到底部
          </button>
          <input
            type="number"
            min="0"
            max={items.length - 1}
            value={targetIndex}
            onChange={(e) => setTargetIndex(Number(e.target.value))}
            style={{
              padding: "8px",
              width: "80px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
          <button
            onClick={handleScrollToItem}
            style={{
              padding: "8px 16px",
              background: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            滚动到指定项
          </button>
        </div>

        <h3 style={{ marginBottom: "12px", fontSize: "1.1em" }}>📊 获取信息</h3>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            marginBottom: "12px",
          }}
        >
          <button
            onClick={handleGetLayoutInfo}
            style={{
              padding: "8px 16px",
              background: "#17a2b8",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            获取布局信息
          </button>
          <button
            onClick={handleGetVisibleItems}
            style={{
              padding: "8px 16px",
              background: "#17a2b8",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            获取可见项
          </button>
          <button
            onClick={handleGetItemPosition}
            style={{
              padding: "8px 16px",
              background: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            获取项位置
          </button>
          <button
            onClick={handleRelayout}
            style={{
              padding: "8px 16px",
              background: "#ffc107",
              color: "#333",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            强制重新布局
          </button>
        </div>

        {layoutInfo && (
          <div
            style={{
              padding: "8px 12px",
              background: "#e7f3ff",
              borderRadius: "4px",
              marginBottom: "8px",
              fontSize: "14px",
            }}
          >
            {layoutInfo}
          </div>
        )}
        {visibleInfo && (
          <div
            style={{
              padding: "8px 12px",
              background: "#e7ffe7",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          >
            {visibleInfo}
          </div>
        )}
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
          ref={waterfallRef}
          items={items}
          columns={3}
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
