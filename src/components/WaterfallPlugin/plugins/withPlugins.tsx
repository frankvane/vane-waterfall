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
        visibleRange: { start: 0, end: visibleItems.size },
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

    // 注册插件
    useEffect(() => {
      if (enableDebug) {
        console.debug(
          "[withPlugins] registering plugins:",
          plugins.map((p) => p.name)
        );
      }

      pluginManager.registerAll(plugins);

      return () => {
        pluginManager.clear();
      };
    }, [plugins, pluginManager, enableDebug]);

    // 挂载时触发插件钩子
    useEffect(() => {
      const cleanups: Array<void | (() => void)> = [];

      plugins.forEach((plugin) => {
        const cleanup = plugin.hooks.onMount?.(pluginContext);
        if (cleanup) cleanups.push(cleanup);
      });

      pluginManager.executeHook("onMount", pluginContext).catch(() => {});

      return () => {
        pluginManager.executeHook("onUnmount", pluginContext).catch(() => {});
        cleanups.forEach((fn) => typeof fn === "function" && fn());
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
    }, [props, plugins]);

    // 生命周期钩子注入
    const enhancedProps: WaterfallCoreProps<T> = {
      ...transformedProps,
      containerRefExternal: containerRef,
      itemRefsExternal: itemRefsMap,

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
        pluginManager
          .executeHook("onItemEnterViewport", pluginContext, index, {
            index,
            isVisible: true,
            visibleRatio: 1,
            isAboveViewport: false,
            isBelowViewport: false,
          })
          .catch(() => {});
      },
      onItemLeaveViewport: (index) => {
        transformedProps.onItemLeaveViewport?.(index);
        pluginManager
          .executeHook("onItemLeaveViewport", pluginContext, index, {
            index,
            isVisible: false,
            visibleRatio: 0,
            isAboveViewport: false,
            isBelowViewport: false,
          })
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
