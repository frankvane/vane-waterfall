import React, { useMemo, useRef } from "react";
import DemoPage from "./_layout/DemoPage";
import { WaterfallCore, withPlugins } from "@/components/WaterfallPlugin";
import type { WaterfallCoreRef } from "@/components/WaterfallPlugin";
import { createBookmarkPlugin } from "@/components/WaterfallPlugin/custom-plugins";

interface Item { id: number; title: string; color: string; height: number; }

const items = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  title: `Item ${i + 1}`,
  color: `hsl(${(i * 29) % 360}, 70%, 85%)`,
  height: 120 + Math.floor(Math.random() * 160),
}));

const WaterfallCompAny = withPlugins<Item>(WaterfallCore, {
  plugins: [createBookmarkPlugin()],
});

export default function BookmarkDemo() {
  const data = useMemo(() => items, []);
  const coreRef = useRef<WaterfallCoreRef>(null);
  return (
    <DemoPage title="Bookmark 插件演示" description="支持键盘快捷键 b/r 设置与恢复书签，无需按钮。">
      <div style={{ marginBottom: 12, color: "#666" }}>
        提示：滚动列表后按 <b>b</b> 设置书签，按 <b>r</b> 恢复到书签位置。
      </div>
      <div style={{ height: 600, border: "1px solid #ddd", borderRadius: 8, overflow: "hidden" }}>
        <WaterfallCompAny
          ref={coreRef}
          items={data}
          columns={4}
          gap={12}
          containerStyle={{ height: "100%", background: "#f5f5f5", padding: "16px" }}
          renderItem={(item) => (
            <div style={{ background: item.color, height: item.height, borderRadius: 6, padding: "8px 10px" }}>
              <div style={{ fontWeight: 600 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: "#666" }}>滚动后试试书签操作</div>
            </div>
          )}
        />
      </div>
    </DemoPage>
  );
}