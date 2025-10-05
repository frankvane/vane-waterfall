import {
  FILTER_PRESETS,
  LazyLoadImageCore,
  withPlugins as VaneLazyImage,
  createA11yPlugin,
  createAltTextPlugin,
  createBadgePlugin,
  createBlurUpPlugin,
  createCachePrewarmPlugin,
  createConcurrencyControlPlugin,
  createErrorBadgePlugin,
  createFadeInPlugin,
  createFallbackImagePlugin,
  createFilterPlugin,
  createHoverZoomPlugin,
  createIDBCachePlugin,
  createMemoryCachePlugin,
  createPreconnectPlugin,
  createScrollIdlePlugin,
  createSkeletonPlugin,
  createWatermarkPlugin,
} from "vane-lazy-image";
import {
  WaterfallCore,
  createAlignmentPlugin,
  createAutoColumnPlugin,
  createBookmarkPlugin,
  createInfiniteScrollPlugin,
  createResponsiveColumnsPlugin,
  createTransitionPlugin,
  withPlugins
} from "vane-waterfall";
import { useEffect, useMemo, useRef, useState } from "react";

import DemoPage from "./_layout/DemoPage";

interface Item {
  id: number;
  title: string;
  color: string;
  height: number;
  url: string;
}
const LazyImage = VaneLazyImage(LazyLoadImageCore as any, [
  createSkeletonPlugin({}),
  createFadeInPlugin({}),
  createMemoryCachePlugin({ maxEntries: 200 }),
  createIDBCachePlugin({}),
  createCachePrewarmPlugin({ trigger: "enter", preferMemory: true }),
  createPreconnectPlugin({}),
  createFallbackImagePlugin({ fallbackSrc: "/404.jpg" }),
  createWatermarkPlugin({
    text: "VANE",
    position: "bottom-right",
    opacity: 0.6,
  }),
  createBlurUpPlugin({ startBlur: 8, endBlur: 0, durationMs: 500 }),
  createBadgePlugin({
    // 使用插件上下文读取每个实例的 props，实现按图片序号显示
    // 宽化类型，避免 LazyLoadImageCoreProps 上无 badgeText 报错
    text: (ctx) => String((ctx.props as any)?.badgeText ?? ""),
    position: "top-left",
  }),
  createFilterPlugin(FILTER_PRESETS.grayscaleSoft),
  createHoverZoomPlugin({ scale: 1.15, durationMs: 180 }),
  createConcurrencyControlPlugin({
    maxConcurrent: 4,
    adaptive: true,
    scope: "perHost",
    acquireTimeoutMs: 6000,
  }),
  createScrollIdlePlugin({
    idleMs: 160,
    maxWaitMs: 1200,
    onlyWhenIntersecting: true,
  }),
  createErrorBadgePlugin({}),
  createA11yPlugin(),
  createAltTextPlugin({ prefix: "Demo" }),
]);

// 为了给 Badge 插件传递 badgeText（类型未在核心声明），在本地进行类型宽化
const LazyImageAny = LazyImage as any;

const initialItems = Array.from({ length: 60 }, (_, i) => ({
  id: i + 1,
  title: `Item ${i + 1}`,
  color: `hsl(${(i * 37) % 360}, 75%, 85%)`,
  height: 120 + Math.floor(Math.random() * 180),
  url: `https://picsum.photos/seed/wfall-${i + 1}/640/480`,
}));

export default function InfiniteScrollDemo() {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // 使用 ref 持有最新的状态，避免插件持有的闭包读取到旧值导致继续加载
  const loadingRef = useRef(loading);
  const hasMoreRef = useRef(hasMore);
  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);
  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  const loadMore = async () => {
    // 使用 ref 读取最新值，保证停止条件生效
    if (loadingRef.current || !hasMoreRef.current) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setItems((prev) => {
      const start = prev.length;
      const add = Array.from({ length: 24 }, (_, i) => ({
        id: start + i + 1,
        title: `Item ${start + i + 1}`,
        color: `hsl(${((start + i) * 37) % 360}, 75%, 85%)`,
        height: 120 + Math.floor(Math.random() * 180),
        url: `https://picsum.photos/seed/cache-combo-${start + i + 1}/800/600`,
      }));
      const next = [...prev, ...add];
      if (next.length >= 200) setHasMore(false);
      return next;
    });
    setLoading(false);
  };

  const WaterfallWithInfinite = useMemo(
    () =>
      withPlugins(WaterfallCore, [
        // 视口宽度自适应列数（优先级：AutoColumn -> ResponsiveColumns -> props.columns）
        createAutoColumnPlugin({
          minColumnWidth: 220,
          minColumns: 1,
          maxColumns: 6,
        }),
        createResponsiveColumnsPlugin({
          breakpoints: {
            xs: { width: 0, columns: 1 },
            sm: { width: 640, columns: 2 },
            md: { width: 768, columns: 3 },
            lg: { width: 1024, columns: 4 },
            xl: { width: 1280, columns: 5 },
          },
        }),
        // 列分配策略（按最矮列放置）
        createAlignmentPlugin({ mode: "shortest" }),
        createBookmarkPlugin({
          storageKey: "waterfall-bookmark",
          scrollBehavior: "smooth",
        }),
        createTransitionPlugin({ duration: 180, easing: "ease-out" }),
        createInfiniteScrollPlugin({ threshold: 0, onLoadMore: loadMore }),
      ]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <DemoPage
      title="LazyImage 集成瀑布流演示"
      description="展示 LazyLoadImage × WaterfallPlugin 的插件化集成与无限滚动。"
    >
      <div
        style={{
          height: 600,
          border: "1px solid #ddd",
          borderRadius: 8,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <WaterfallWithInfinite
          items={items}
          columns={4}
          gap={12}
          padding={12}
          containerStyle={{
            height: "100%",
            background: "#f5f5f5",
          }}
          onReachBottom={async () => {
            if (hasMore) await loadMore();
          }}
          renderItem={(item, index) => (
            <div
              style={{
                height: item.height,
                borderRadius: 8,
                overflow: "hidden",
                background: item.color,
              }}
            >
              <LazyImageAny
                src={item.url}
                loading="lazy"
                badgeText={index + 1}
                containerStyle={{ width: "100%", height: "100%" }}
                imageStyle={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                alt={item.title}
              />
            </div>
          )}
        />
        {loading && (
          <div
            style={{
              position: "absolute",
              bottom: 8,
              left: "50%",
              transform: "translateX(-50%)",
              background: "#e9f7ff",
              border: "1px solid #b6e3ff",
              borderRadius: 6,
              padding: "6px 8px",
              fontSize: 12,
            }}
          >
            数据加载中...
          </div>
        )}
        {!hasMore && (
          <div
            style={{
              position: "absolute",
              bottom: 8,
              left: "50%",
              transform: "translateX(-50%)",
              background: "#fff3cd",
              border: "1px solid #ffeeba",
              borderRadius: 6,
              padding: "6px 8px",
              fontSize: 12,
            }}
          >
            我是有底线的
          </div>
        )}
      </div>
    </DemoPage>
  );
}
