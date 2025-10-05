import type { WaterfallPlugin } from "../../plugins/types";

type PaginationConfig = {
  /** 每页数量 */
  pageSize?: number;
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
    },
  };
}