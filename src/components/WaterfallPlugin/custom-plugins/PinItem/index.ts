import type { ItemPosition, WaterfallPlugin } from "../../plugins/types";

type PinItemConfig = {
  /** 置顶的项索引列表 */
  pinnedIndices: number[];
  /** 固定到的列（默认 0） */
  column?: number;
};

/**
 * PinItemPlugin - 将指定索引的项固定在顶部某列
 * - 通过 calculateItemPosition 覆盖其位置，使其始终位于顶部
 */
export function createPinItemPlugin<T = any>(config: PinItemConfig): WaterfallPlugin<T> {
  const column = config.column ?? 0;
  const pinned = new Set(config.pinnedIndices);
  let pinnedOffset = 0;

  return {
    name: "PinItemPlugin",
    enabled: true,
    hooks: {
      onBeforeLayout: () => {
        // 每次布局前重置置顶累积偏移量
        pinnedOffset = 0;
        return true;
      },
      calculateItemPosition: (context, index, itemHeight): ItemPosition | undefined => {
        if (!pinned.has(index)) return undefined;

        const { columnWidth, gap } = context.layout;
        const x = column * (columnWidth + gap);

        return {
          x,
          y: pinnedOffset,
          width: columnWidth,
          height: itemHeight,
          column,
          row: 0,
        };
      },
      renderOverlay: () => null,
    },
  };
}