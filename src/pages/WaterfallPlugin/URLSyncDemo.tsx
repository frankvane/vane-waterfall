import React, { useEffect, useMemo, useState } from "react";
import DemoPage from "./_layout/DemoPage";
import { WaterfallCore, withPlugins } from "@/components/WaterfallPlugin";
import { createURLSyncPlugin } from "@/components/WaterfallPlugin/custom-plugins";

interface Item { id: number; title: string; color: string; height: number; }

const items = Array.from({ length: 80 }, (_, i) => ({
  id: i + 1,
  title: `Item ${i + 1}`,
  color: `hsl(${(i * 37) % 360}, 70%, 85%)`,
  height: 120 + Math.floor(Math.random() * 160),
}));

const WaterfallCompAny = withPlugins<Item>(WaterfallCore, {
  plugins: [createURLSyncPlugin({ mode: "hash", keys: ["pageIndex", "pageSize", "searchQuery"] })],
}) as any;

export default function URLSyncDemo() {
  const data = useMemo(() => items, []);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(24);
  const [searchQuery, setSearchQuery] = useState("");

  // 从 URL 读取初始状态（与 URLSyncPlugin 相同规则）
  useEffect(() => {
    try {
      const raw = window.location.hash || "";
      const idx = raw.indexOf("?");
      const paramStr = idx >= 0 ? raw.slice(idx + 1) : raw.replace(/^#/, "");
      const params = new URLSearchParams(paramStr);
      const pi = Number(params.get("pageIndex") || "");
      const ps = Number(params.get("pageSize") || "");
      const sq = params.get("searchQuery") || "";
      if (!Number.isNaN(pi) && pi > 0) setPageIndex(pi);
      if (!Number.isNaN(ps) && ps > 0) setPageSize(ps);
      if (sq) setSearchQuery(sq);
    } catch {}
  }, []);

  // 根据搜索词过滤，再分页
  const filtered = useMemo(() => {
    if (!searchQuery) return data;
    const q = searchQuery.toLowerCase();
    return data.filter((it) => it.title.toLowerCase().includes(q));
  }, [data, searchQuery]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const goto = (next: number) => {
    if (next < 1) next = 1;
    if (next > totalPages) next = totalPages;
    setPageIndex(next);
  };

  const pagedItems = useMemo(() => {
    const start = (pageIndex - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, pageIndex, pageSize]);

  return (
    <DemoPage title="URLSync 插件演示" description="分页/每页数量/搜索词同步到 URL（hash 或 search），刷新后仍可恢复。">
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
        <label style={{ marginLeft: 12 }}>
          搜索词：
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="输入关键词" />
        </label>
      </div>

      <div style={{ height: 600, border: "1px solid #ddd", borderRadius: 8, overflow: "hidden" }}>
        <WaterfallCompAny
          items={pagedItems}
          columns={4}
          gap={12}
          pageIndex={pageIndex}
          pageSize={pageSize}
          searchQuery={searchQuery}
          containerStyle={{ height: "100%", background: "#f5f5f5", padding: "16px" }}
          renderItem={(item: Item) => (
            <div style={{ background: item.color, height: item.height, borderRadius: 6, padding: "8px 10px" }}>
              <div style={{ fontWeight: 600 }}>{item.title}</div>
            </div>
          )}
        />
      </div>
      <div style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
        当前页显示：{pagedItems.length} 项，全部：{filtered.length} 项
      </div>
    </DemoPage>
  );
}