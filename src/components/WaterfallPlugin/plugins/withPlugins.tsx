/**
 * withPlugins - HOC 组合器
 * 为 WaterfallCore 注入插件系统，支持插件生命周期管理和钩子执行
 */

import type {
  DeviceInfo,
  ItemPosition,
  LayoutInfo,
  NetworkInfo,
  PluginManager,
  ViewportInfo,
  WaterfallPlugin,
  WaterfallPluginContext,
} from "./types";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  WaterfallCoreProps,
  WaterfallCoreRef,
} from "../core/WaterfallCore";

import { createPluginBus } from "./PluginBus";
import { createPluginManager } from "./PluginManager";

export interface WithPluginsConfig<T = any> {
  plugins: WaterfallPlugin<T>[];
  enableDebug?: boolean;
}

// 检测网络信息
function detectNetwork(): NetworkInfo | undefined {
  const nav: any = typeof navigator !== "undefined" ? navigator : undefined;
  const conn = nav?.connection || nav?.mozConnection || nav?.webkitConnection;
  if (!conn) return undefined;
  return {
    effectiveType: conn.effectiveType || "4g",
    downlink: Number(conn.downlink || 10),
    rtt: Number(conn.rtt || 50),
    saveData: Boolean(conn.saveData || false),
    online: nav?.onLine !== false,
  };
}

// 检测设备信息
function detectDevice(): DeviceInfo {
  const width = typeof window !== "undefined" ? window.innerWidth : 1024;
  const height = typeof window !== "undefined" ? window.innerHeight : 768;
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  const ua = typeof navigator !== "undefined" ? navigator.userAgent || "" : "";

  const isMobile = /Mobile|Android|iPhone|iPad/i.test(ua);
  const isTablet = /iPad|Tablet/i.test(ua);
  const type: DeviceInfo["type"] = isTablet
    ? "tablet"
    : isMobile
    ? "mobile"
    : "desktop";

  const isTouchDevice =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  return {
    type,
    os: ua,
    browser: ua,
    devicePixelRatio: dpr,
    viewportWidth: width,
    viewportHeight: height,
    isTouchDevice,
    isRetina: dpr >= 2,
  };
}

export function withPlugins<T = any>(
  WrappedComponent: React.ForwardRefExoticComponent<
    React.PropsWithoutRef<WaterfallCoreProps<T>> &
      React.RefAttributes<WaterfallCoreRef>
  >,
  config: WithPluginsConfig<T> | WaterfallPlugin<T>[]
) {
  const normalized: WithPluginsConfig<T> = Array.isArray(config)
    ? { plugins: config, enableDebug: false }
    : config;

  const { plugins, enableDebug = false } = normalized;

  const WithPluginsComponent = forwardRef<
    WaterfallCoreRef,
    WaterfallCoreProps<T>
  >((props, ref) => {
    // 插件管理器和事件总线
    const pluginManagerRef = useRef<PluginManager<T>>(createPluginManager<T>());
    const pluginManager = pluginManagerRef.current;
    const busRef = useRef(createPluginBus());
    const bus = busRef.current;

    // Refs
    const containerRef = useRef<HTMLDivElement | null>(null);
    const itemRefsMap = useRef<Map<number, HTMLElement>>(new Map());
    const sharedDataRef = useRef<Map<string, any>>(new Map());
    const coreRef = useRef<WaterfallCoreRef>(null);

    // State
    const [layoutInfo, setLayoutInfo] = useState<LayoutInfo>({
      columns: props.columns || 3,
      columnWidth: 0,
      gap: props.gap || 16,
      columnHeights: [],
      totalHeight: 0,
      containerWidth: 0,
      containerHeight: 0,
    });

    const [itemPositions, setItemPositions] = useState<
      Map<number, ItemPosition>
    >(new Map());

    const [viewportInfo, setViewportInfo] = useState<ViewportInfo>({
      scrollTop: 0,
      scrollLeft: 0,
      scrollHeight: 0,
      scrollWidth: 0,
      clientHeight: 0,
      clientWidth: 0,
      isScrolling: false,
      direction: null,
    });

    const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
    const [isLayouting, setIsLayouting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // 网络与设备信息
    const networkInfo = useMemo(() => detectNetwork(), []);
    const deviceInfo = useMemo(() => detectDevice(), []);

    // 构造插件上下文
    const pluginContext: WaterfallPluginContext<T> = useMemo(
      () => ({
        items: props.items || [],
        itemCount: (props.items || []).length,
        containerRef,
        itemRefs: itemRefsMap.current,
        getItemRef: (index: number) => itemRefsMap.current.get(index) || null,
        layout: layoutInfo,
        itemPositions,
        getItemPosition: (index: number) => itemPositions.get(index) || null,
        viewport: viewportInfo,
        visibleItems,
        // 通过视口与项位置计算真实可见范围（最小/最大可见索引）
        visibleRange: (() => {
          const container = containerRef.current;
          if (!container || itemPositions.size === 0) return { start: 0, end: 0 };
          const vt = container.scrollTop;
          const vb = vt + container.clientHeight;
          let minIndex: number | null = null;
          let maxIndex: number | null = null;
          itemPositions.forEach((pos, idx) => {
            const it = pos.y;
            const ib = pos.y + pos.height;
            const overlap = Math.max(0, Math.min(vb, ib) - Math.max(vt, it));
            if (overlap > 0) {
              if (minIndex === null || idx < minIndex) minIndex = idx;
              if (maxIndex === null || idx > maxIndex) maxIndex = idx;
            }
          });
          return {
            start: minIndex ?? 0,
            end: maxIndex ?? 0,
          };
        })(),
        isLayouting,
        isScrolling: viewportInfo.isScrolling,
        isDragging: false,
        isLoading,
        hasMore,
        error,
        props: props as WaterfallCoreProps<T>,
        bus,
        sharedData: sharedDataRef.current,
        networkInfo,
        deviceInfo,
        relayout: () => coreRef.current?.relayout(),
        scrollToItem: (index, options) =>
          coreRef.current?.scrollToItem(index, options),
        scrollToTop: (options) => coreRef.current?.scrollToTop(options),
        scrollToBottom: (options) => coreRef.current?.scrollToBottom(options),
        measureItem: (index) =>
          coreRef.current?.measureItem(index) ||
          Promise.resolve({ width: 0, height: 0 }),
        forceUpdate: () => coreRef.current?.forceUpdate(),
      }),
      [
        props,
        layoutInfo,
        itemPositions,
        viewportInfo,
        visibleItems,
        isLayouting,
        isLoading,
        hasMore,
        error,
        bus,
        networkInfo,
        deviceInfo,
      ]
    );

    // 注册插件（渲染期执行，确保核心组件的 onMount 之前插件已可用）
    const prevPluginNamesRef = useRef<string[]>([]);
    const currentNames = plugins.map((p) => p.name);
    if (
      prevPluginNamesRef.current.length === 0 ||
      prevPluginNamesRef.current.join("|") !== currentNames.join("|")
    ) {
      if (enableDebug) {
        console.debug(
          "[withPlugins] register plugins:",
          currentNames
        );
      }
      pluginManager.clear();
      pluginManager.registerAll(plugins);
      prevPluginNamesRef.current = currentNames;
    }

    // 说明：onMount/onUnmount 生命周期统一由核心组件回调触发，避免重复执行

    // Props 变化时触发插件钩子
    const prevPropsRef = useRef(props);
    useEffect(() => {
      const prevProps = prevPropsRef.current;
      if (prevProps !== props) {
        pluginManager
          .executeHook("onPropsChange", pluginContext, prevProps, props)
          .catch(() => {});
        prevPropsRef.current = props;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    // transformProps 链式处理
    const transformedProps = useMemo(() => {
      let p = { ...props } as WaterfallCoreProps<T>;
      plugins.forEach((plugin) => {
        if (plugin.hooks.transformProps) {
          p = plugin.hooks.transformProps(p);
        }
      });
      return p;
    }, [props, plugins, viewportInfo.clientWidth]);

    // 生命周期钩子注入
    const enhancedProps: WaterfallCoreProps<T> = {
      ...transformedProps,
      containerRefExternal: containerRef,
      itemRefsExternal: itemRefsMap,
      // 将 enableDebug 作为默认值传递给核心的 debug（用户显式设置优先）
      debug: transformedProps.debug ?? enableDebug,

      // 挂载/卸载
      onMount: () => {
        transformedProps.onMount?.();
        pluginManager.executeHook("onMount", pluginContext).catch(() => {});
      },
      onUnmount: () => {
        transformedProps.onUnmount?.();
        pluginManager.executeHook("onUnmount", pluginContext).catch(() => {});
      },

      // 布局钩子
      onBeforeLayout: async () => {
        setIsLayouting(true);
        const result = await pluginManager.executeHook(
          "onBeforeLayout",
          pluginContext
        );
        if (result === false) return false;
        return transformedProps.onBeforeLayout?.() ?? true;
      },
      onLayout: () => {
        transformedProps.onLayout?.();
        pluginManager.executeHook("onLayout", pluginContext).catch(() => {});
      },
      onLayoutComplete: () => {
        setIsLayouting(false);
        transformedProps.onLayoutComplete?.();
        pluginManager
          .executeHook("onLayoutComplete", pluginContext)
          .catch(() => {});

        // 更新布局信息
        if (coreRef.current) {
          setLayoutInfo(coreRef.current.getLayoutInfo());
          setItemPositions(coreRef.current.getAllItemPositions());
        }
      },

      // 项生命周期钩子
      onItemMount: (index, element) => {
        transformedProps.onItemMount?.(index, element);
        pluginManager
          .executeHook("onItemMount", pluginContext, index, element)
          .catch(() => {});
      },
      onItemUnmount: (index) => {
        transformedProps.onItemUnmount?.(index);
        pluginManager
          .executeHook("onItemUnmount", pluginContext, index)
          .catch(() => {});
      },
      onItemEnterViewport: (index) => {
        transformedProps.onItemEnterViewport?.(index);
        // 计算真实可见性信息
        const container = containerRef.current;
        const pos = itemPositions.get(index);
        const visibility = (() => {
          if (!container || !pos) {
            return {
              index,
              isVisible: true,
              visibleRatio: 1,
              isAboveViewport: false,
              isBelowViewport: false,
            };
          }
          const vt = container.scrollTop;
          const vb = vt + container.clientHeight;
          const it = pos.y;
          const ib = pos.y + pos.height;
          const overlap = Math.max(0, Math.min(vb, ib) - Math.max(vt, it));
          const ratio = Math.min(1, Math.max(0, overlap / pos.height));
          return {
            index,
            isVisible: overlap > 0,
            visibleRatio: ratio,
            isAboveViewport: ib <= vt,
            isBelowViewport: it >= vb,
          };
        })();
        pluginManager
          .executeHook("onItemEnterViewport", pluginContext, index, visibility)
          .catch(() => {});
      },
      onItemLeaveViewport: (index) => {
        transformedProps.onItemLeaveViewport?.(index);
        // 计算真实可见性信息
        const container = containerRef.current;
        const pos = itemPositions.get(index);
        const visibility = (() => {
          if (!container || !pos) {
            return {
              index,
              isVisible: false,
              visibleRatio: 0,
              isAboveViewport: false,
              isBelowViewport: false,
            };
          }
          const vt = container.scrollTop;
          const vb = vt + container.clientHeight;
          const it = pos.y;
          const ib = pos.y + pos.height;
          const overlap = Math.max(0, Math.min(vb, ib) - Math.max(vt, it));
          const ratio = Math.min(1, Math.max(0, overlap / pos.height));
          return {
            index,
            isVisible: overlap > 0,
            visibleRatio: ratio,
            isAboveViewport: ib <= vt,
            isBelowViewport: it >= vb,
          };
        })();
        pluginManager
          .executeHook("onItemLeaveViewport", pluginContext, index, visibility)
          .catch(() => {});
      },

      // 滚动钩子
      onScroll: (scrollTop, scrollLeft) => {
        transformedProps.onScroll?.(scrollTop, scrollLeft);
        pluginManager
          .executeHook("onScroll", pluginContext, scrollTop, scrollLeft)
          .catch(() => {});

        // 更新视口信息
        if (containerRef.current) {
          setViewportInfo((prev) => ({
            ...prev,
            scrollTop,
            scrollLeft,
            isScrolling: true,
          }));
        }
      },

      // 尺寸变化钩子
      onResize: (width, height) => {
        transformedProps.onResize?.(width, height);
        setViewportInfo((prev) => ({
          ...prev,
          clientWidth: width,
          clientHeight: height,
        }));
        pluginManager
          .executeHook("onResize", pluginContext, width, height)
          .catch(() => {});
      },

      // 到达底部钩子
      onReachBottom: async (distance) => {
        await transformedProps.onReachBottom?.(distance);
        await pluginManager.executeHook(
          "onReachBottom",
          pluginContext,
          distance
        );
      },

      // 项点击钩子
      onItemClick: (index, item, event) => {
        transformedProps.onItemClick?.(index, item, event);
        pluginManager
          .executeHook("onItemClick", pluginContext, index, item, event)
          .catch(() => {});
      },

      // 渲染项：允许插件包装项容器（renderItemWrapper）
      renderItem: (item: any, index: number) => {
        const original = transformedProps.renderItem || ((it: any) => null);
        let children = original(item, index);
        for (const plugin of plugins) {
          const wrap = plugin.hooks.renderItemWrapper?.(
            pluginContext,
            index,
            item,
            children
          );
          if (wrap !== undefined && wrap !== null) {
            children = wrap;
          }
        }
        return children;
      },

      // 子元素
      children: (
        <>
          {transformedProps.children}
          {/* 插件渲染的覆盖层 */}
          {plugins.map((plugin, idx) => {
            const overlay = plugin.hooks.renderOverlay?.(pluginContext);
            if (!overlay) return null;
            return (
              <React.Fragment key={`plugin-overlay-${plugin.name}-${idx}`}>
                {overlay}
              </React.Fragment>
            );
          })}
        </>
      ),
    };

    // 暴露给外部的 ref
    React.useImperativeHandle(ref, () => ({
      relayout: () => coreRef.current?.relayout(),
      scrollToItem: (index, options) =>
        coreRef.current?.scrollToItem(index, options),
      scrollToTop: (options) => coreRef.current?.scrollToTop(options),
      scrollToBottom: (options) => coreRef.current?.scrollToBottom(options),
      getItemPosition: (index) =>
        coreRef.current?.getItemPosition(index) || null,
      getAllItemPositions: () =>
        coreRef.current?.getAllItemPositions() || new Map(),
      getColumnHeights: () => coreRef.current?.getColumnHeights() || [],
      getLayoutInfo: () =>
        coreRef.current?.getLayoutInfo() || {
          columns: 0,
          columnWidth: 0,
          gap: 0,
          columnHeights: [],
          totalHeight: 0,
          containerWidth: 0,
          containerHeight: 0,
        },
      getViewportInfo: () =>
        coreRef.current?.getViewportInfo() || {
          scrollTop: 0,
          scrollLeft: 0,
          scrollHeight: 0,
          scrollWidth: 0,
          clientHeight: 0,
          clientWidth: 0,
          isScrolling: false,
          direction: null,
        },
      forceUpdate: () => coreRef.current?.forceUpdate(),
      getContainer: () => coreRef.current?.getContainer() || null,
      getItemElement: (index) => coreRef.current?.getItemElement(index) || null,
      measureItem: (index) =>
        coreRef.current?.measureItem(index) ||
        Promise.resolve({ width: 0, height: 0 }),
    }));

    return <WrappedComponent ref={coreRef} {...enhancedProps} />;
  });

  WithPluginsComponent.displayName = "WithPlugins(WaterfallCore)";
  return WithPluginsComponent;
}
