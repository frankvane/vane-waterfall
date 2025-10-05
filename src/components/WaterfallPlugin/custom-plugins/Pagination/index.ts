import type { WaterfallPlugin } from "../../plugins/types";

type PaginationConfig = {
  /** 每页数量 */
  pageSize?: number;
  /** 翻页后自动滚动到顶部 */
  scrollToTop?: boolean;
  /** 滚动行为（auto/smooth），仅在启用 scrollToTop 时生效 */
  scrollBehavior?: "auto" | "smooth";
};

/**
 * PaginationPlugin - 基于 props 中的 pageIndex/pageSize 对 items 进行分页切片
 * 支持通过 config.pageSize 设定默认每页数量
 */
export function createPaginationPlugin<T = any>(config: PaginationConfig = {}): WaterfallPlugin<T> {
  return {
    name: "PaginationPlugin",
    enabled: true,
    hooks: {
      transformProps: (props: any) => {
        const pageIndex: number = Math.max(0, Number(props.pageIndex ?? 0));
        const pageSize: number = Math.max(1, Number(props.pageSize ?? config.pageSize ?? 20));
        const items: T[] = Array.isArray(props.items) ? props.items : [];
        const start = pageIndex * pageSize;
        const end = start + pageSize;
        const sliced = items.slice(start, end);
        return { ...props, items: sliced } as any;
      },
      onPropsChange: (context, prevProps: any, nextProps: any) => {
        // 仅在页码变化时触发“滚动到顶部”逻辑
        const prevIndex = Math.max(0, Number(prevProps?.pageIndex ?? 0));
        const nextIndex = Math.max(0, Number(nextProps?.pageIndex ?? 0));
        const enabledFromProps = typeof nextProps?.scrollToTopOnPageChange === "boolean"
          ? nextProps.scrollToTopOnPageChange
          : undefined;
        const shouldScroll = (enabledFromProps ?? Boolean(config.scrollToTop)) && prevIndex !== nextIndex;
        if (shouldScroll) {
          const behavior: "auto" | "smooth" = (nextProps?.scrollToTopBehavior as any) ?? config.scrollBehavior ?? "auto";
          context.scrollToTop?.({ behavior });
        }
      },
    },
  };
}