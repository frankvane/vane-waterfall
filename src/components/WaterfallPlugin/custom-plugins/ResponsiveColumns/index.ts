import type { WaterfallPlugin } from "../../plugins/types";

type Breakpoint = { width: number; columns: number };
type Breakpoints = Record<string, Breakpoint>;

export function createResponsiveColumnsPlugin<T = any>(config: {
  breakpoints: Breakpoints;
}): WaterfallPlugin<T> {
  const getColumnsByWidth = (w: number, fallback: number) => {
    const list = Object.values(config.breakpoints).sort(
      (a, b) => a.width - b.width
    );
    let cols = fallback;
    for (const bp of list) {
      if (w >= bp.width) cols = bp.columns;
    }
    return cols;
  };

  return {
    name: "ResponsiveColumnsPlugin",
    enabled: true,
    hooks: {
      transformProps: (props) => {
        const fallback = props.columns ?? 3;
        const w = typeof window !== "undefined" ? window.innerWidth : 1024;
        const columns = getColumnsByWidth(w, fallback);
        return { ...props, columns };
      },
      onResize: (context, width) => {
        // 依赖 HOC 在 onResize 中更新 viewportInfo，从而触发 transformProps 重新计算
        // 这里无需直接修改 props，仅确保在尺寸变化后能重新布局
        context.relayout?.();
      },
    },
  };
}