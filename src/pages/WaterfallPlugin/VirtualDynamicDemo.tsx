import React, { useMemo } from "react";
import DemoPage from "./_layout/DemoPage";
import { WaterfallCore, withPlugins } from "@/components/WaterfallPlugin";
import { createVirtualWaterfallPlugin } from "@/components/WaterfallPlugin/custom-plugins";

interface DynamicItem {
  id: number;
  title: string;
  color: string;
  paragraphs: number; // 文段数量，决定内容高度但不可精确预测
}

// 固定容器宽度，便于演示不可预测文本内容的动态高度瀑布流
const CONTAINER_WIDTH = 960;
const COLUMNS = 4;
const GAP = 12;

const VirtualDynamic = withPlugins(WaterfallCore, [
  createVirtualWaterfallPlugin<DynamicItem>({
    overscanPx: 400,
    dynamicHeights: true,
    estimateItemHeight: 220, // 初始估算高度，用于首屏布局
  }),
]);

// 生成稳定且“看似随机”的段落文本：基于 itemId 和段落索引的伪随机，
// 保证每次渲染同一个项时内容长度不变，避免高度抖动。
function genParagraphStable(itemId: number, paraIndex: number, len: number) {
  const base =
    "在插件 overlay 中使用 ResizeObserver 测量真实高度，结合像素范围虚拟化，避免一次性渲染全部内容。";
  const variantLen = 20 + ((itemId * 17 + paraIndex * 31) % 80);
  const sliceLen = Math.min(base.length, variantLen);
  const piece = base.slice(0, sliceLen);
  return Array.from({ length: len })
    .map(() => piece)
    .join(" ");
}

export default function VirtualDynamicDemo() {
  const items = useMemo(() => {
    return Array.from({ length: 200 }, (_, i) => ({
      id: i + 1,
      title: `Card ${i + 1}`,
      color: `hsl(${(i * 47) % 360}, 70%, 85%)`,
      paragraphs: 1 + Math.floor(Math.random() * 7),
    }));
  }, []);

  return (
    <DemoPage
      title="虚拟瀑布流（不可预测高度）"
      description="不为项设置固定高度，由内容自然撑开。插件开启动态测量与虚拟化，仅渲染视口附近项。"
    >
      <div style={{ marginBottom: 12, color: "#666" }}>
        文本长度变化导致真实高度不可提前知道：先用估算值排布，随后测量刷新位置。
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
        <VirtualDynamic
          items={items}
          columns={COLUMNS}
          gap={GAP}
          renderItem={(item: DynamicItem) => (
            // 不设置 height，由内容自然撑开，让插件测量真实高度
            <div
              style={{
                borderRadius: 6,
                overflow: "hidden",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                background: item.color,
                color: "#333",
                padding: "10px 12px",
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: 8 }}>{item.title}</div>
              {Array.from({ length: item.paragraphs }).map((_, idx) => (
                <p key={idx} style={{ margin: "6px 0" }}>
                  {genParagraphStable(item.id, idx, 1 + ((item.id + idx) % 4))}
                </p>
              ))}
            </div>
          )}
          containerStyle={{ height: "100%" }}
        />
      </div>
    </DemoPage>
  );
}