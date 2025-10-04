import React, { useCallback, useMemo, useRef, useState } from "react";

import DemoPage from "./_layout/DemoPage";
import { WaterfallCore } from "@/components/WaterfallPlugin";

interface WaterfallItem {
  id: number;
  title: string;
  color: string;
  height: number;
}

interface LogEntry {
  time: string;
  event: string;
  detail: string;
}

export default function LifecycleDemo() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [itemCount, setItemCount] = useState(30);
  const [autoScroll, setAutoScroll] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const logsContainerRef = useRef<HTMLDivElement>(null);

  const items = useMemo(() => {
    return Array.from({ length: itemCount }, (_, i) => ({
      id: i + 1,
      title: `Item ${i + 1}`,
      color: `hsl(${(i * 137.5) % 360}, 70%, 80%)`,
      height: Math.floor(Math.random() * 200) + 150,
    }));
  }, [itemCount]);

  const addLog = useCallback((event: string, detail: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev.slice(-19), { time, event, detail }]);
    // 仅在启用自动滚动且用户当前接近底部时，滚动到底部
    setTimeout(() => {
      const container = logsContainerRef.current;
      if (!container) return;
      const nearBottom =
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 8; // 距离底部阈值
      if (autoScroll && nearBottom) {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  }, []);

  const handleMount = useCallback(() => {
    addLog("onMount", "组件已挂载");
  }, [addLog]);

  const handleBeforeLayout = useCallback(() => {
    addLog("onBeforeLayout", "准备开始布局");
    return true;
  }, [addLog]);

  const handleLayout = useCallback(() => {
    addLog("onLayout", "正在计算布局");
  }, [addLog]);

  const handleLayoutComplete = useCallback(() => {
    addLog("onLayoutComplete", "布局计算完成");
  }, [addLog]);

  const scrollCountRef = useRef(0);
  const handleScroll = useCallback(
    (scrollTop: number) => {
      scrollCountRef.current++;
      // 每 5 次滚动记录一次，避免日志过多
      if (scrollCountRef.current % 5 === 0) {
        addLog("onScroll", `滚动位置: ${scrollTop.toFixed(0)}px`);
      }
    },
    [addLog]
  );

  const handleReachBottom = useCallback(
    (distance: number) => {
      addLog(
        "onReachBottom",
        `到达底部，距离: ${distance.toFixed(0)}px - 可加载更多数据`
      );
    },
    [addLog]
  );

  const handleItemClick = useCallback(
    (index: number, item: WaterfallItem) => {
      addLog("onItemClick", `点击了 ${item.title} (索引: ${index})`);
    },
    [addLog]
  );

  const handleItemEnterViewport = useCallback(
    (index: number) => {
      addLog("onItemEnterViewport", `Item ${index + 1} 进入视口`);
    },
    [addLog]
  );

  const handleItemLeaveViewport = useCallback(
    (index: number) => {
      addLog("onItemLeaveViewport", `Item ${index + 1} 离开视口`);
    },
    [addLog]
  );

  const handleResize = useCallback(
    (width: number, height: number) => {
      addLog(
        "onResize",
        `容器尺寸变化: ${width.toFixed(0)}x${height.toFixed(0)}`
      );
    },
    [addLog]
  );

  const clearLogs = () => {
    setLogs([]);
  };

  const addMoreItems = () => {
    setItemCount((prev) => prev + 10);
    addLog("手动操作", `增加 10 个项，总数: ${itemCount + 10}`);
  };

  return (
    <DemoPage
      title="生命周期和事件"
      description="演示组件的生命周期钩子和各种事件监听，实时查看事件触发日志"
    >
      <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: "12px" }}>
            <button
              onClick={clearLogs}
              style={{
                padding: "8px 16px",
                background: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginRight: "8px",
              }}
            >
              清空日志
            </button>
            <button
              onClick={addMoreItems}
              style={{
                padding: "8px 16px",
                background: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              添加更多项
            </button>
            <span style={{ marginLeft: "12px", color: "#666" }}>
              当前项数: {itemCount}
            </span>
            <label style={{ marginLeft: "16px", color: "#666", display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <input
                type="checkbox"
                checked={autoScroll}
                onChange={(e) => setAutoScroll(e.target.checked)}
              />
              自动滚动到底部（仅当接近底部时）
            </label>
          </div>

          <div
            style={{
              height: "200px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              padding: "12px",
              background: "#f8f9fa",
              overflow: "auto",
              fontFamily: "monospace",
              fontSize: "13px",
            }}
            ref={logsContainerRef}
          >
            <div
              style={{
                fontWeight: "bold",
                marginBottom: "8px",
                color: "#333",
              }}
            >
              📋 事件日志 (实时更新)
            </div>
            {logs.length === 0 ? (
              <div style={{ color: "#999" }}>暂无日志，开始交互查看事件</div>
            ) : (
              logs.map((log, idx) => (
                <div
                  key={idx}
                  style={{
                    marginBottom: "4px",
                    padding: "4px 8px",
                    background: "white",
                    borderRadius: "2px",
                    borderLeft: "3px solid #007bff",
                  }}
                >
                  <span style={{ color: "#999" }}>[{log.time}]</span>{" "}
                  <span style={{ color: "#007bff", fontWeight: "bold" }}>
                    {log.event}
                  </span>
                  : {log.detail}
                </div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>

          <div
            style={{
              marginTop: "12px",
              padding: "12px",
              background: "#fff3cd",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          >
            <strong>💡 提示：</strong>
            <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
              <li>滚动查看 onScroll 事件</li>
              <li>点击项查看 onItemClick 事件</li>
              <li>滚动到底部触发 onReachBottom</li>
              <li>添加项查看布局相关事件</li>
            </ul>
          </div>
        </div>
      </div>

      <div
        style={{
          height: "500px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <WaterfallCore
          items={items}
          columns={3}
          gap={16}
          onMount={handleMount}
          onBeforeLayout={handleBeforeLayout}
          onLayout={handleLayout}
          onLayoutComplete={handleLayoutComplete}
          onScroll={handleScroll}
          onReachBottom={handleReachBottom}
          onItemClick={handleItemClick}
          onItemEnterViewport={handleItemEnterViewport}
          onItemLeaveViewport={handleItemLeaveViewport}
          onResize={handleResize}
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
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.currentTarget.click();
                }
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
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
