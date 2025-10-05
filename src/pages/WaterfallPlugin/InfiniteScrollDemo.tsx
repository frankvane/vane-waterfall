import React, { useMemo, useState } from "react";
import DemoPage from "./_layout/DemoPage";
import { WaterfallCore, withPlugins } from "@/components/WaterfallPlugin";
import { createInfiniteScrollPlugin } from "@/components/WaterfallPlugin/custom-plugins";

interface Item { id: number; title: string; color: string; height: number; }

const initialItems = Array.from({ length: 60 }, (_, i) => ({
  id: i + 1,
  title: `Item ${i + 1}`,
  color: `hsl(${(i * 37) % 360}, 75%, 85%)`,
  height: 120 + Math.floor(Math.random() * 180),
}));

export default function InfiniteScrollDemo() {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setItems((prev) => {
      const start = prev.length;
      const add = Array.from({ length: 24 }, (_, i) => ({
        id: start + i + 1,
        title: `Item ${start + i + 1}`,
        color: `hsl(${((start + i) * 37) % 360}, 75%, 85%)`,
        height: 120 + Math.floor(Math.random() * 180),
      }));
      const next = [...prev, ...add];
      if (next.length >= 200) setHasMore(false);
      return next;
    });
    setLoading(false);
  };

  const WaterfallWithInfinite = useMemo(
    () => withPlugins(WaterfallCore, [createInfiniteScrollPlugin({ threshold: 0, onLoadMore: loadMore })]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <DemoPage title="InfiniteScroll 插件演示" description="滚动到底部自动加载更多。">
      <div style={{ height: 600, border: "1px solid #ddd", borderRadius: 8, overflow: "hidden", position: "relative" }}>
        <WaterfallWithInfinite
          items={items}
          columns={4}
          gap={12}
          containerStyle={{
            height: "100%",
            background: "#f5f5f5",
            padding: "16px",
          }}
          onReachBottom={async () => {
            if (hasMore) await loadMore();
          }}
          renderItem={(item) => (
            <div style={{ background: item.color, height: item.height, borderRadius: 6, padding: "8px 10px" }}>
              <div style={{ fontWeight: 600 }}>{item.title}</div>
              {loading && <div style={{ marginTop: 6, fontSize: 12, color: "#555" }}>加载中...</div>}
            </div>
          )}
        />
        {!hasMore && (
          <div style={{ position: "absolute", bottom: 8, right: 8, background: "#fff3cd", border: "1px solid #ffeeba", borderRadius: 6, padding: "6px 8px", fontSize: 12 }}>
            已无更多数据
          </div>
        )}
      </div>
    </DemoPage>
  );
}