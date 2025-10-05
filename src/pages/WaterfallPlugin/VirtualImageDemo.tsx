import React, { useMemo } from "react";
import { WaterfallCore, createVirtualWaterfallPlugin, withPlugins } from "vane-waterfall";

import DemoPage from "./_layout/DemoPage";

interface ImageItem {
  id: number;
  url: string;
  title: string;
  height: number; // 依据列宽和图片纵横比预先计算出的高度
}

// 固定容器宽度，便于演示依据列宽计算图片高度的虚拟瀑布流
const CONTAINER_WIDTH = 960;
const COLUMNS = 4;
const GAP = 12;
const COLUMN_WIDTH = Math.floor((CONTAINER_WIDTH - (COLUMNS - 1) * GAP) / COLUMNS);

const VirtualImages = withPlugins(WaterfallCore, [
  createVirtualWaterfallPlugin<ImageItem>({
    overscanPx: 400,
    getItemHeight: (item) => item.height,
  }),
]);

export default function VirtualImageDemo() {
  const items = useMemo(() => {
    // 构造图片项，使用随机纵横比计算高度，并生成对应尺寸的图片 URL
    return Array.from({ length: 400 }, (_, i) => {
      const aspectRatio = 0.75 + Math.random() * 0.85; // 大约 0.75 ~ 1.6 的纵横比
      const height = Math.round(COLUMN_WIDTH * aspectRatio);
      const id = (i % 100) + 1; // picsum 有很多 id，可循环复用
      const url = `https://picsum.photos/id/${id}/${COLUMN_WIDTH}/${height}`;
      return {
        id: i + 1,
        url,
        title: `Photo ${i + 1}`,
        height,
      } as ImageItem;
    });
  }, []);

  return (
    <DemoPage
      title="虚拟瀑布流（可预测高度）"
      description="此示例为可预测高度：高度基于列宽与纵横比预先计算。为加快演示，可用不同高度的色块替代图片。"
    >
      <div style={{ marginBottom: 12, color: "#666" }}>
        图片项提前根据列宽和纵横比计算高度，核心仅渲染视口附近项，滚动更流畅。
      </div>

      <div
        style={{
          width: `${CONTAINER_WIDTH}px`,
          height: "650px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <VirtualImages
          items={items}
          columns={COLUMNS}
          gap={GAP}
          renderItem={(item: ImageItem) => (
            // 为演示速度，使用色块替代图片，但高度仍为预计算值
            <div
              style={{
                height: item.height,
                borderRadius: 6,
                overflow: "hidden",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                background: `hsl(${(item.id * 137.5) % 360}, 70%, 80%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#333",
                fontWeight: 500,
              }}
            >
              {item.title}
            </div>
          )}
          containerStyle={{ height: "100%" }}
        />
      </div>
    </DemoPage>
  );
}