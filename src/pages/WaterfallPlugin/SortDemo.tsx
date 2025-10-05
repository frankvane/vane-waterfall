import React, { useMemo, useState } from "react";
import { WaterfallCore, withPlugins } from "@/components/WaterfallPlugin";

import DemoPage from "./_layout/DemoPage";
import { createSortPlugin } from "@/components/WaterfallPlugin/custom-plugins";

type Order = "asc" | "desc";
type SortBy = "date" | "size" | "name";

interface Item { id: number; name: string; date: number; size: number; color: string; height: number; }

const items = Array.from({ length: 90 }, (_, i) => ({
  id: i + 1,
  name: `Item ${String(i + 1).padStart(2, "0")}`,
  date: Date.now() - i * 1000 * 60 * 60,
  size: Math.floor(Math.random() * 1000),
  color: `hsl(${(i * 17) % 360}, 72%, 85%)`,
  height: 120 + Math.floor(Math.random() * 160),
}));

export default function SortDemo() {
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [order, setOrder] = useState<Order>("desc");

  const WaterfallWithSort = useMemo(
    () => withPlugins(WaterfallCore, [
      createSortPlugin<Item>({ scrollToTop: true, scrollBehavior: "smooth" }),
    ]),
    []
  );

  const comparator = (a: Item, b: Item) => {
    let v = 0;
    switch (sortBy) {
      case "date":
        v = a.date - b.date;
        break;
      case "size":
        v = a.size - b.size;
        break;
      case "name":
        v = a.name.localeCompare(b.name);
        break;
    }
    return order === "asc" ? v : -v;
  };
  const WaterfallCompAny = WaterfallWithSort as any;

  return (
    <DemoPage title="Sort 插件演示" description="根据选择的规则对项目排序。">
      <div style={{ marginBottom: 12, display: "flex", gap: 8, alignItems: "center" }}>
        <label>排序字段：</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortBy)}>
          <option value="date">date</option>
          <option value="size">size</option>
          <option value="name">name</option>
        </select>
        <label>顺序：</label>
        <select value={order} onChange={(e) => setOrder(e.target.value as Order)}>
          <option value="asc">asc</option>
          <option value="desc">desc</option>
        </select>
      </div>

      <div style={{ height: 600, border: "1px solid #ddd", borderRadius: 8, overflow: "hidden" }}>
        {/** 使用 JSX 方式渲染，避免将组件当作函数调用 */}
        <WaterfallCompAny
          items={items}
          columns={4}
          gap={12}
          sortComparator={comparator}
          scrollToTopOnSortChange={true}
          scrollToTopBehavior={"smooth"}
          containerStyle={{
            height: "100%",
            background: "#f5f5f5",
            padding: "16px",
          }}
          renderItem={(item: Item) => (
            <div style={{ background: item.color, height: item.height, borderRadius: 6, padding: "8px 10px" }}>
              <div style={{ fontWeight: 600 }}>{item.name}</div>
              <div style={{ fontSize: 12, color: "#666" }}>size: {item.size}</div>
            </div>
          )}
        />
      </div>
    </DemoPage>
  );
}