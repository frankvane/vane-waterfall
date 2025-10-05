import React, { useEffect, useMemo, useState } from "react";
import { WaterfallCore, createPaginationPlugin, createStatePersistencePlugin, withPlugins } from "vane-waterfall";

import DemoPage from "./_layout/DemoPage";

interface Item { id: number; title: string; color: string; height: number; }

const items = Array.from({ length: 80 }, (_, i) => ({
  id: i + 1,
  title: `Item ${i + 1}`,
  color: `hsl(${(i * 37) % 360}, 70%, 85%)`,
  height: 120 + Math.floor(Math.random() * 160),
}));

const WaterfallCompAny = withPlugins<Item>(WaterfallCore, {
  plugins: [
    createStatePersistencePlugin({ persistScroll: true, persistKeys: ["pageIndex", "pageSize"] }),
    createPaginationPlugin(),
  ],
}) as any;

export default function StatePersistenceDemo() {
  const data = useMemo(() => items, []);
  // 为避免刷新后首帧显示为 1，这里用惰性初始化读取插件使用的持久化快照
  const [pageIndex, setPageIndex] = useState(() => {
    try {
      const raw = localStorage.getItem("waterfall-state");
      if (raw) {
        const snap = JSON.parse(raw);
        const pi = Number(snap?.pageIndex);
        if (!Number.isNaN(pi) && pi > 0) return pi;
      }
    } catch {}
    return 1;
  });
  const [pageSize, setPageSize] = useState(() => {
    try {
      const raw = localStorage.getItem("waterfall-state");
      if (raw) {
        const snap = JSON.parse(raw);
        const ps = Number(snap?.pageSize);
        if (!Number.isNaN(ps) && ps > 0) return ps;
      }
    } catch {}
    return 24;
  });

  // 由插件广播的恢复事件来同步页面状态（不直接访问 localStorage）
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail || {};
      const pi = Number(detail.pageIndex);
      const ps = Number(detail.pageSize);
      if (!Number.isNaN(pi) && pi > 0) setPageIndex(pi);
      if (!Number.isNaN(ps) && ps > 0) setPageSize(ps);
    };
    window.addEventListener("waterfall:state-restored", handler as EventListener);
    return () => window.removeEventListener("waterfall:state-restored", handler as EventListener);
  }, []);

  const totalPages = Math.ceil(data.length / pageSize);
  const goto = (next: number) => {
    if (next < 1) next = 1;
    if (next > totalPages) next = totalPages;
    setPageIndex(next);
  };

  return (
    <DemoPage title="StatePersistence 插件演示" description="挂载时尝试恢复滚动与分页；卸载时持久化快照。">
      <div style={{ marginBottom: 12, display: "flex", gap: 8, alignItems: "center" }}>
        <button onClick={() => goto(pageIndex - 1)} disabled={pageIndex <= 1}>上一页</button>
        <button onClick={() => goto(pageIndex + 1)} disabled={pageIndex >= totalPages}>下一页</button>
        <span>第 {pageIndex} / {totalPages} 页</span>
        <label style={{ marginLeft: 12 }}>
          每页数量：
          <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={36}>36</option>
          </select>
        </label>
      </div>

      <div style={{ height: 600, border: "1px solid #ddd", borderRadius: 8, overflow: "hidden" }}>
        <WaterfallCompAny
          items={data}
          columns={4}
          gap={12}
          pageIndex={pageIndex}
          pageSize={pageSize}
          containerStyle={{ height: "100%", background: "#f5f5f5", padding: "16px" }}
          renderItem={(item: Item) => (
            <div style={{ background: item.color, height: item.height, borderRadius: 6, padding: "8px 10px" }}>
              <div style={{ fontWeight: 600 }}>{item.title}</div>
            </div>
          )}
        />
      </div>
    </DemoPage>
  );
}