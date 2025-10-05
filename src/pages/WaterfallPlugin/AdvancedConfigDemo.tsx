import React, { useMemo, useState } from "react";

import DemoPage from "./_layout/DemoPage";
import { WaterfallCore } from "vane-waterfall";

interface WaterfallItem {
  id: number;
  title: string;
  color: string;
  height: number;
}

export default function AdvancedConfigDemo() {
  const [useTransform, setUseTransform] = useState(true);
  const [debug, setDebug] = useState(false);
  const [padding, setPadding] = useState({
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
  });

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
      title="高级配置"
      description="演示高级配置选项：内边距、定位方式、调试模式等"
    >
      <div style={{ marginBottom: "16px" }}>
        <h3 style={{ marginBottom: "12px", fontSize: "1.1em" }}>⚙️ 配置选项</h3>

        {/* Transform vs 绝对定位 */}
        <div
          style={{
            marginBottom: "16px",
            padding: "12px",
            background: "#f8f9fa",
            borderRadius: "4px",
          }}
        >
          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              checked={useTransform}
              onChange={(e) => setUseTransform(e.target.checked)}
            />
            <strong>useTransform</strong>
            <span style={{ color: "#666", fontSize: "14px" }}>
              {useTransform
                ? "✅ 使用 Transform 定位 (性能更好，GPU 加速)"
                : "❌ 使用绝对定位 (left/top)"}
            </span>
          </label>
        </div>

        {/* Debug 模式 */}
        <div
          style={{
            marginBottom: "16px",
            padding: "12px",
            background: "#f8f9fa",
            borderRadius: "4px",
          }}
        >
          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              checked={debug}
              onChange={(e) => setDebug(e.target.checked)}
            />
            <strong>debug</strong>
            <span style={{ color: "#666", fontSize: "14px" }}>
              {debug ? "✅ 调试模式开启 (查看控制台输出)" : "关闭调试模式"}
            </span>
          </label>
        </div>

        {/* Padding 配置 */}
        <div
          style={{
            marginBottom: "16px",
            padding: "12px",
            background: "#f8f9fa",
            borderRadius: "4px",
          }}
        >
          <div style={{ marginBottom: "12px" }}>
            <strong>padding</strong> - 容器内边距
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "12px",
            }}
          >
            <div>
              <label style={{ display: "block", marginBottom: "4px" }}>
                上边距: {padding.top}px
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={padding.top}
                onChange={(e) =>
                  setPadding((p) => ({ ...p, top: Number(e.target.value) }))
                }
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "4px" }}>
                右边距: {padding.right}px
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={padding.right}
                onChange={(e) =>
                  setPadding((p) => ({ ...p, right: Number(e.target.value) }))
                }
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "4px" }}>
                下边距: {padding.bottom}px
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={padding.bottom}
                onChange={(e) =>
                  setPadding((p) => ({ ...p, bottom: Number(e.target.value) }))
                }
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "4px" }}>
                左边距: {padding.left}px
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={padding.left}
                onChange={(e) =>
                  setPadding((p) => ({ ...p, left: Number(e.target.value) }))
                }
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "12px",
            background: "#d1ecf1",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        >
          <strong>💡 说明：</strong>
          <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
            <li>
              <strong>useTransform</strong>: 使用 CSS Transform 进行定位，GPU
              加速，性能更好
            </li>
            <li>
              <strong>debug</strong>: 开启后会在控制台输出布局计算时间和详细信息
            </li>
            <li>
              <strong>padding</strong>: 容器内边距，可以统一设置或分别设置四边
            </li>
          </ul>
        </div>
      </div>

      <div
        style={{
          height: "600px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* 显示内边距参考线 */}
        {(padding.top > 0 ||
          padding.right > 0 ||
          padding.bottom > 0 ||
          padding.left > 0) && (
          <div
            style={{
              position: "absolute",
              top: padding.top,
              right: padding.right,
              bottom: padding.bottom,
              left: padding.left,
              border: "2px dashed #007bff",
              pointerEvents: "none",
              zIndex: 10,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-20px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "#007bff",
                color: "white",
                padding: "2px 8px",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            >
              内容区域
            </div>
          </div>
        )}

        <WaterfallCore
          items={items}
          columns={3}
          gap={16}
          padding={padding}
          useTransform={useTransform}
          debug={debug}
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
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.currentTarget.click();
                }
              }}
            >
              <div>{item.title}</div>
              <div style={{ fontSize: "12px", marginTop: "8px", opacity: 0.7 }}>
                {useTransform ? "Transform" : "Absolute"}
              </div>
            </div>
          )}
          keyExtractor={(item: WaterfallItem) => item.id}
          itemStyle={{
            // 自定义项样式
            border: "2px solid rgba(0,0,0,0.1)",
          }}
          containerStyle={{
            height: "100%",
            background: "#f5f5f5",
          }}
        />
      </div>
    </DemoPage>
  );
}
