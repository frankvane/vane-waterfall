import type { WaterfallPlugin } from "../../plugins/types";

type AutoColumnConfig = {
  /** 每列最小宽度（含内容区，不含列间距） */
  minColumnWidth: number;
  /** 最大列数（可选） */
  maxColumns?: number;
  /** 最小列数（可选，默认 1） */
  minColumns?: number;
};

/**
 * 根据视口宽度和最小列宽自动计算列数
 * 公式（近似）：columns = floor((availableWidth + columnGap) / (minColumnWidth + columnGap))
 * - availableWidth 近似取 window.innerWidth，避免强依赖容器 ref
 * - 考虑 padding 与 columnGap，提高真实布局的贴合度
 */
export function createAutoColumnPlugin<T = any>(config: AutoColumnConfig): WaterfallPlugin<T> {
  const getHorizontalPadding = (padding: AutoColumnConfig | any): number => {
    if (!padding) return 0;
    if (typeof padding === "number") return padding * 2;
    const { left = 0, right = 0 } = padding as { left?: number; right?: number };
    return left + right;
  };

  return {
    name: "AutoColumnPlugin",
    enabled: true,
    hooks: {
      transformProps: (props) => {
        const w = typeof window !== "undefined" ? window.innerWidth : 1024;
        const columnGap = props.columnGap ?? props.gap ?? 0;
        const horizontalPadding = getHorizontalPadding(props.padding);

        // 估算可用宽度（容器宽度近似取视口宽度，扣除左右 padding）
        const available = Math.max(0, w - horizontalPadding);
        const base = Math.max(1, Math.floor((available + columnGap) / (config.minColumnWidth + columnGap)));

        const minCols = Math.max(1, config.minColumns ?? 1);
        const maxCols = config.maxColumns ?? Number.POSITIVE_INFINITY;
        const nextColumns = Math.min(Math.max(base, minCols), maxCols);

        return {
          ...props,
          columns: nextColumns,
        };
      },
      onResize: (context) => {
        // 依赖 HOC 的 viewportInfo 变化触发 transformProps 重算，这里确保重新布局
        context.relayout?.();
      },
    },
  };
}