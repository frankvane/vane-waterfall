import type { WaterfallPlugin } from "../../plugins/types";

type InfiniteScrollConfig = {
  /** 触发加载的距离阈值（像素） */
  threshold?: number;
  /** 加载更多的回调，由页面传入 */
  onLoadMore?: () => Promise<void> | void;
};

/**
 * InfiniteScrollPlugin - 到达底部触发加载更多
 * 通过 transformProps 包装 onReachBottom，实现基于阈值的加载触发
 */
export function createInfiniteScrollPlugin<T = any>(config: InfiniteScrollConfig = {}): WaterfallPlugin<T> {
  return {
    name: "InfiniteScrollPlugin",
    enabled: true,
    hooks: {
      transformProps: (props: any) => {
        const originalOnReachBottom = props.onReachBottom;
        const threshold = Math.max(0, Number(config.threshold ?? 0));
        const onLoadMore = config.onLoadMore ?? props.onLoadMore;
        return {
          ...props,
          onReachBottom: async (distance: number) => {
            // 先触发原始回调（如果有）
            if (typeof originalOnReachBottom === "function") {
              await Promise.resolve(originalOnReachBottom(distance));
            }
            // 基于阈值判定触发
            if (distance <= threshold && typeof onLoadMore === "function") {
              await Promise.resolve(onLoadMore());
            }
          },
        } as any;
      },
    },
  };
}