import type { WaterfallPlugin } from "../../plugins/types";
import type React from "react";

type DragReorderConfig = {
  /** 是否启用（默认 true） */
  enabled?: boolean;
};

/**
 * DragReorderPlugin - 拖拽重排
 * - 为项包装器添加可拖拽样式与属性
 * - 记录最后一次拖拽的 from/to 索引（sharedData）
 * - 实际数据重排需外层配合（示例页提供）
 */
export function createDragReorderPlugin<T = any>(config: DragReorderConfig = {}): WaterfallPlugin<T> {
  const enabled = config.enabled ?? true;
  return {
    name: "DragReorderPlugin",
    enabled,
    hooks: {
      renderItemWrapper: (context, index, _item, children) => {
        const draggable = enabled;
        const onDragStart = (e: React.DragEvent) => {
          e.dataTransfer.setData("text/plain", String(index));
      context.sharedData?.set("drag-from", index);
        };
        const onDragOver = (e: React.DragEvent) => {
          e.preventDefault();
        };
        const onDrop = (e: React.DragEvent) => {
          const from = Number(e.dataTransfer.getData("text/plain"));
          const to = index;
      context.sharedData?.set("drag-to", to);
          context.bus?.emit("drag:reorder", { from, to });
          // 同步广播到全局，便于示例页显示最近操作（占位事件）
          if (typeof window !== "undefined") {
            try {
              window.dispatchEvent(new CustomEvent("waterfall:drag-reorder", { detail: { from, to } }));
            } catch {}
          }
          // 占位：仅记录，不直接修改 items
        };
        return (
          <div
            draggable={draggable}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            style={{
              cursor: draggable ? "grab" : "default",
              border: "1px dashed #bdbdbd",
              borderRadius: 6,
            }}
          >
            {children}
          </div>
        );
      },

    },
  };
}