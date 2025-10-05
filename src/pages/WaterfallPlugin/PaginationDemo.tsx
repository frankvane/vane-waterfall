import React, { useMemo, useState } from "react";
import DemoPage from "./_layout/DemoPage";
import { WaterfallCore, withPlugins } from "@/components/WaterfallPlugin";
import { createPaginationPlugin } from "@/components/WaterfallPlugin/custom-plugins";

interface Item { id: number; title: string; color: string; height: number; }

const allItems = Array.from({ length: 200 }, (_, i) => ({
  id: i + 1,
  title: `Item ${i + 1}`,
  color: `hsl(${(i * 23) % 360}, 72%, 85%)`,
  height: 100 + Math.floor(Math.random() * 160),
}));

export default function PaginationDemo() {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(24);

  const WaterfallWithPagination = useMemo(
    () => withPlugins(WaterfallCore, [createPaginationPlugin({ pageSize })]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pageSize]
  );

  const totalPages = Math.ceil(allItems.length / pageSize);
  const WaterfallCompAny = WaterfallWithPagination as any;

  const goto = (next: number) => {
    if (next < 1) next = 1;
    if (next > totalPages) next = totalPages;
    setPageIndex(next);
  };

  return (
    <DemoPage title="Pagination 插件演示" description="通过 props.pageIndex/pageSize 对列表进行分页。">
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
        {/** 使用 JSX 方式渲染，避免将组件当作函数调用 */}
        <WaterfallCompAny
          items={allItems}
          columns={4}
          gap={12}
          pageIndex={pageIndex}
          pageSize={pageSize}
          containerStyle={{
            height: "100%",
            background: "#f5f5f5",
            padding: "16px",
          }}
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