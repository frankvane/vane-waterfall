import React, { useMemo, useState } from "react";
import { WaterfallCore, createSearchPlugin, withPlugins } from "vane-waterfall";

import DemoPage from "./_layout/DemoPage";

interface Item { id: number; title: string; tags: string[]; color: string; height: number; }

const allItems: Item[] = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  title: `Item ${i + 1}`,
  tags: ["alpha", "beta", "gamma", "delta", "photo", "video", "doc"].slice(0, 1 + (i % 5)),
  color: `hsl(${(i * 29) % 360}, 70%, 88%)`,
  height: 110 + Math.floor(Math.random() * 160),
}));

export default function SearchDemo() {
  const [query, setQuery] = useState("");

  const WaterfallWithSearch = useMemo(
    () => withPlugins(WaterfallCore, [
      createSearchPlugin<Item>({ fields: ["title", "tags"], scrollToTop: true, scrollBehavior: "smooth" }),
    ]),
    []
  );
  const WaterfallCompAny = WaterfallWithSearch as any;

  return (
    <DemoPage title="Search 插件演示" description="在指定字段中进行关键词包含搜索。">
      <div style={{ marginBottom: 12, display: "flex", gap: 8, alignItems: "center" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="输入关键词，如 alpha 或 photo"
          style={{ width: 280 }}
        />
      </div>

      <div style={{ height: 600, border: "1px solid #ddd", borderRadius: 8, overflow: "hidden" }}>
        {/** 使用 JSX 方式渲染，避免将组件当作函数调用 */}
        <WaterfallCompAny
          items={allItems}
          columns={4}
          gap={12}
          searchQuery={query}
          scrollToTopOnSearchChange={true}
          scrollToTopBehavior={"smooth"}
          containerStyle={{
            height: "100%",
            background: "#f5f5f5",
            padding: "16px",
          }}
          renderItem={(item: Item) => (
            <div style={{ background: item.color, height: item.height, borderRadius: 6, padding: "8px 10px" }}>
              <div style={{ fontWeight: 600 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: "#666" }}>tags: {item.tags.join(", ")}</div>
            </div>
          )}
        />
      </div>
    </DemoPage>
  );
}