import React, { useMemo, useState } from "react";
import { WaterfallCore, withPlugins } from "@/components/WaterfallPlugin";

import DemoPage from "./_layout/DemoPage";
import { createFilterPlugin } from "@/components/WaterfallPlugin/custom-plugins";

interface Item { id: number; title: string; category: "photo" | "video" | "doc"; color: string; height: number; }

const baseItems = Array.from({ length: 80 }, (_, i) => ({
  id: i + 1,
  title: `Item ${i + 1}`,
  category: ((): Item["category"] => {
    const types: Item["category"][] = ["photo", "video", "doc"];
    return types[(i % types.length)];
  })(),
  color: `hsl(${(i * 31) % 360}, 70%, 88%)`,
  height: 120 + Math.floor(Math.random() * 160),
}));

export default function FilterDemo() {
  const [category, setCategory] = useState<Item["category"] | "all">("photo");

  const WaterfallWithFilter = useMemo(
    () => withPlugins(WaterfallCore, [
      createFilterPlugin<Item>({ scrollToTop: true, scrollBehavior: "smooth" }),
    ]),
    []
  );

  const predicate = (item: Item) => (category === "all" ? true : item.category === category);
  const WaterfallCompAny = WaterfallWithFilter as any;

  return (
    <DemoPage title="Filter 插件演示" description="通过筛选函数过滤显示的项目。">
      <div style={{ marginBottom: 12, display: "flex", gap: 8, alignItems: "center" }}>
        <label>分类：</label>
        <select value={category} onChange={(e) => setCategory(e.target.value as any)}>
          <option value="photo">photo</option>
          <option value="video">video</option>
          <option value="doc">doc</option>
          <option value="all">全部</option>
        </select>
      </div>

      <div style={{ height: 600, border: "1px solid #ddd", borderRadius: 8, overflow: "hidden" }}>
        {/** 使用 JSX 方式渲染，避免将组件当作函数调用 */}
        <WaterfallCompAny
          items={baseItems}
          columns={4}
          gap={12}
          filterFn={predicate}
          scrollToTopOnFilterChange={true}
          scrollToTopBehavior={"smooth"}
          containerStyle={{
            height: "100%",
            background: "#f5f5f5",
            padding: "16px",
          }}
          renderItem={(item: Item) => (
            <div style={{ background: item.color, height: item.height, borderRadius: 6, padding: "8px 10px" }}>
              <div style={{ fontWeight: 600 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: "#666" }}>分类：{item.category}</div>
            </div>
          )}
        />
      </div>
    </DemoPage>
  );
}