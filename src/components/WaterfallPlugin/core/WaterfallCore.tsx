/**
 * WaterfallCore - 瀑布流核心组件
 *
 * 职责：
 * 1. 管理瀑布流布局计算
 * 2. 处理滚动和尺寸变化
 * 3. 维护项位置映射
 * 4. 提供生命周期钩子
 * 5. 管理 DOM 引用
 *
 * 设计原则：
 * - 保持核心功能简单纯粹
 * - 所有扩展功能通过插件实现
 * - 提供完整的上下文供插件使用
 */

import type {
  ItemKeyExtractor,
  ItemPosition,
  LayoutInfo,
  ViewportInfo,
} from "../plugins/types";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

// ============ Props 定义 ============

export interface WaterfallCoreProps<T = any> {
  // ===== 数据相关 =====
  /**
   * 数据源
   */
  items: T[];

  /**
   * 渲染函数
   */
  renderItem: (item: T, index: number) => React.ReactNode;

  /**
   * 键提取函数（用于 React key）
   */
  keyExtractor?: ItemKeyExtractor<T>;

  // ===== 布局配置 =====
  /**
   * 列数（可由插件动态计算）
   */
  columns?: number;

  /**
   * 列间距
   */
  gap?: number;

  /**
   * 行间距（可选，默认等于 gap）
   */
  rowGap?: number;

  /**
   * 列间距（可选，默认等于 gap）
   */
  columnGap?: number;

  /**
   * 容器内边距
   */
  padding?:
    | number
    | { top?: number; right?: number; bottom?: number; left?: number };

  // ===== 样式相关 =====
  /**
   * 容器样式
   */
  containerStyle?: React.CSSProperties;

  /**
   * 容器类名
   */
  containerClassName?: string;

  /**
   * 项容器样式
   */
  itemStyle?: React.CSSProperties;

  /**
   * 项容器类名
   */
  itemClassName?: string;

  // ===== 性能配置 =====
  /**
   * 是否启用虚拟滚动（由插件控制）
   */
  virtual?: boolean;

  /**
   * 预估项高度（用于虚拟滚动）
   */
  estimateItemHeight?: number;

  /**
   * 预渲染项数（虚拟滚动时上下额外渲染的项数）
   */
  overscan?: number;

  /**
   * 是否使用 transform 定位（性能更好）
   */
  useTransform?: boolean;

  /**
   * 节流延迟（ms）
   */
  throttleDelay?: number;

  /**
   * 防抖延迟（ms）
   */
  debounceDelay?: number;

  // ===== 生命周期钩子（由插件注入） =====
  onMount?: () => void;
  onUnmount?: () => void;
  onBeforeLayout?: () => boolean | Promise<boolean>;
  onLayout?: () => void;
  onLayoutComplete?: () => void;
  onItemMount?: (index: number, element: HTMLElement) => void;
  onItemUnmount?: (index: number) => void;
  onItemEnterViewport?: (index: number) => void;
  onItemLeaveViewport?: (index: number) => void;
  onScroll?: (scrollTop: number, scrollLeft: number) => void;
  onResize?: (width: number, height: number) => void;
  onReachBottom?: (distance: number) => void;
  onItemClick?: (index: number, item: T, event: React.MouseEvent) => void;

  // ===== 扩展功能 =====
  /**
   * 子元素（用于插件渲染覆盖层等）
   */
  children?: React.ReactNode;

  /**
   * 外部容器引用（供 HOC 传入）
   */
  containerRefExternal?: React.RefObject<HTMLDivElement | null>;

  /**
   * 外部项引用映射（供 HOC 传入）
   */
  itemRefsExternal?: React.MutableRefObject<Map<number, HTMLElement>>;

  /**
   * 是否启用调试模式
   */
  debug?: boolean;
}

// ============ Ref 暴露接口 ============

export interface WaterfallCoreRef {
  /**
   * 重新布局
   */
  relayout: () => void;

  /**
   * 滚动到指定项
   */
  scrollToItem: (index: number, options?: ScrollToItemOptions) => void;

  /**
   * 滚动到顶部
   */
  scrollToTop: (options?: ScrollToOptions) => void;

  /**
   * 滚动到底部
   */
  scrollToBottom: (options?: ScrollToOptions) => void;

  /**
   * 获取项位置
   */
  getItemPosition: (index: number) => ItemPosition | null;

  /**
   * 获取所有项位置
   */
  getAllItemPositions: () => Map<number, ItemPosition>;

  /**
   * 获取列高度
   */
  getColumnHeights: () => number[];

  /**
   * 获取布局信息
   */
  getLayoutInfo: () => LayoutInfo;

  /**
   * 获取视口信息
   */
  getViewportInfo: () => ViewportInfo;

  /**
   * 获取可见项索引
   */
  getVisibleItems: () => Set<number>;

  /**
   * 强制更新
   */
  forceUpdate: () => void;

  /**
   * 获取容器 DOM
   */
  getContainer: () => HTMLDivElement | null;

  /**
   * 获取项 DOM
   */
  getItemElement: (index: number) => HTMLElement | null;

  /**
   * 测量项尺寸
   */
  measureItem: (index: number) => Promise<{ width: number; height: number }>;
}

export interface ScrollToItemOptions {
  behavior?: "auto" | "smooth";
  block?: "start" | "center" | "end" | "nearest";
  inline?: "start" | "center" | "end" | "nearest";
  offset?: number; // 额外偏移
}

export interface ScrollToOptions {
  behavior?: "auto" | "smooth";
  offset?: number;
}

// ============ 核心组件实现 ============

const WaterfallCore = forwardRef<WaterfallCoreRef, WaterfallCoreProps>(
  function WaterfallCore<T = any>(
    props: WaterfallCoreProps<T>,
    ref: React.ForwardedRef<WaterfallCoreRef>
  ) {
    const {
      items = [],
      renderItem,
      keyExtractor = (item, index) => index,
      columns = 3,
      gap = 16,
      rowGap,
      columnGap,
      padding = 0,
      containerStyle,
      containerClassName,
      itemStyle,
      itemClassName,
      virtual = false,
      estimateItemHeight = 300,
      overscan = 2,
      useTransform = true,
      throttleDelay = 16,
      debounceDelay = 150,
      onMount,
      onUnmount,
      onBeforeLayout,
      onLayout,
      onLayoutComplete,
      onItemMount,
      onItemUnmount,
      onItemEnterViewport,
      onItemLeaveViewport,
      onScroll,
      onResize,
      onReachBottom,
      onItemClick,
      children,
      containerRefExternal,
      itemRefsExternal,
      debug = false,
    } = props;

    // ===== Refs =====
    const internalContainerRef = useRef<HTMLDivElement>(null);
    const internalItemRefsMap = useRef<Map<number, HTMLElement>>(new Map());
    const containerRef = containerRefExternal || internalContainerRef;
    const itemRefsMap = itemRefsExternal || internalItemRefsMap;
    const resizeObserverRef = useRef<ResizeObserver | null>(null);
    const scrollTimerRef = useRef<number>();
    const layoutTimerRef = useRef<number>();

    // ===== State =====
    const [layoutInfo, setLayoutInfo] = useState<LayoutInfo>({
      columns,
      columnWidth: 0,
      gap: columnGap || gap,
      columnHeights: Array(columns).fill(0),
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
    const [, forceUpdateState] = useState({});

    // ===== 计算内边距 =====
    const paddingValues = useMemo(() => {
      if (typeof padding === "number") {
        return { top: padding, right: padding, bottom: padding, left: padding };
      }
      return {
        top: padding.top || 0,
        right: padding.right || 0,
        bottom: padding.bottom || 0,
        left: padding.left || 0,
      };
    }, [padding]);

    // ===== 计算间距 =====
    const rowGapValue = rowGap !== undefined ? rowGap : gap;
    const columnGapValue = columnGap !== undefined ? columnGap : gap;

    // ===== 布局计算 =====
    const calculateLayout = useCallback(async () => {
      const container = containerRef.current;
      const itemRefs = itemRefsMap.current;
      if (!container || items.length === 0) return;

      // 触发 onBeforeLayout 钩子
      if (onBeforeLayout) {
        const shouldContinue = await onBeforeLayout();
        if (shouldContinue === false) return;
      }

      if (debug) console.time("[WaterfallCore] Layout calculation");

      const containerWidth = container.clientWidth;
      const contentWidth =
        containerWidth - paddingValues.left - paddingValues.right;
      const columnWidth =
        (contentWidth - columnGapValue * (columns - 1)) / columns;

      const columnHeights = Array(columns).fill(paddingValues.top);
      const newPositions = new Map<number, ItemPosition>();

      // 触发 onLayout 钩子
      if (onLayout) onLayout();

      // 计算每个项的位置
      for (let i = 0; i < items.length; i++) {
        const itemElement = itemRefs.get(i);
        let itemHeight = estimateItemHeight;

        // 尝试获取实际高度
        if (itemElement) {
          itemHeight = itemElement.offsetHeight || estimateItemHeight;
        }

        // 找到最短的列
        const shortestColumnIndex = columnHeights.indexOf(
          Math.min(...columnHeights)
        );
        const column = shortestColumnIndex;
        const x = paddingValues.left + column * (columnWidth + columnGapValue);
        const y = columnHeights[column];

        newPositions.set(i, {
          x,
          y,
          width: columnWidth,
          height: itemHeight,
          column,
          row: Math.floor(i / columns),
        });

        // 更新列高度
        columnHeights[column] += itemHeight + rowGapValue;
      }

      const totalHeight = Math.max(...columnHeights) + paddingValues.bottom;

      setLayoutInfo({
        columns,
        columnWidth,
        gap: columnGapValue,
        columnHeights,
        totalHeight,
        containerWidth,
        containerHeight: container.clientHeight,
      });

      setItemPositions(newPositions);

      // 触发 onLayoutComplete 钩子
      if (onLayoutComplete) onLayoutComplete();

      if (debug) {
        console.timeEnd("[WaterfallCore] Layout calculation");
        console.log("[WaterfallCore] Layout info:", {
          columns,
          columnWidth,
          totalHeight,
          itemCount: items.length,
        });
      }
    }, [
      items,
      columns,
      columnGapValue,
      rowGapValue,
      paddingValues,
      estimateItemHeight,
      onBeforeLayout,
      onLayout,
      onLayoutComplete,
      debug,
      containerRef,
      itemRefsMap,
    ]);

    // ===== 节流的布局计算 =====
    const throttledCalculateLayout = useCallback(() => {
      if (layoutTimerRef.current) {
        window.clearTimeout(layoutTimerRef.current);
      }
      layoutTimerRef.current = window.setTimeout(() => {
        calculateLayout();
      }, debounceDelay);
    }, [calculateLayout, debounceDelay]);

    // ===== 更新视口信息 =====
    const updateViewportInfo = useCallback(() => {
      const container = containerRef.current;
      if (!container) return;

      const prevScrollTop = viewportInfo.scrollTop;
      const newScrollTop = container.scrollTop;
      const direction =
        newScrollTop > prevScrollTop
          ? "down"
          : newScrollTop < prevScrollTop
          ? "up"
          : null;

      setViewportInfo({
        scrollTop: newScrollTop,
        scrollLeft: container.scrollLeft,
        scrollHeight: container.scrollHeight,
        scrollWidth: container.scrollWidth,
        clientHeight: container.clientHeight,
        clientWidth: container.clientWidth,
        isScrolling: true,
        direction,
      });
    }, [viewportInfo.scrollTop, containerRef]);

    // ===== 计算可见项 =====
    const calculateVisibleItems = useCallback(() => {
      const container = containerRef.current;
      if (!container) return;

      const scrollTop = container.scrollTop;
      const clientHeight = container.clientHeight;
      const viewportTop = scrollTop - overscan * estimateItemHeight;
      const viewportBottom =
        scrollTop + clientHeight + overscan * estimateItemHeight;

      const newVisibleItems = new Set<number>();
      const prevVisibleItems = new Set(visibleItems);

      itemPositions.forEach((position, index) => {
        const itemTop = position.y;
        const itemBottom = position.y + position.height;

        if (itemBottom >= viewportTop && itemTop <= viewportBottom) {
          newVisibleItems.add(index);

          // 触发进入视口事件
          if (!prevVisibleItems.has(index) && onItemEnterViewport) {
            onItemEnterViewport(index);
          }
        } else if (prevVisibleItems.has(index) && onItemLeaveViewport) {
          // 触发离开视口事件
          onItemLeaveViewport(index);
        }
      });

      setVisibleItems(newVisibleItems);
    }, [
      itemPositions,
      overscan,
      estimateItemHeight,
      visibleItems,
      onItemEnterViewport,
      onItemLeaveViewport,
      containerRef,
    ]);

    // ===== 滚动处理 =====
    const handleScroll = useCallback(() => {
      updateViewportInfo();
      calculateVisibleItems();

      const container = containerRef.current;
      if (!container) return;

      // 触发 onScroll 钩子
      if (onScroll) {
        onScroll(container.scrollTop, container.scrollLeft);
      }

      // 检查是否到达底部
      if (onReachBottom) {
        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;
        const distanceToBottom = scrollHeight - (scrollTop + clientHeight);

        if (distanceToBottom < 100) {
          onReachBottom(distanceToBottom);
        }
      }

      // 标记滚动结束
      if (scrollTimerRef.current) {
        window.clearTimeout(scrollTimerRef.current);
      }
      scrollTimerRef.current = window.setTimeout(() => {
        setViewportInfo((prev) => ({ ...prev, isScrolling: false }));
      }, 150);
    }, [
      updateViewportInfo,
      calculateVisibleItems,
      onScroll,
      onReachBottom,
      containerRef,
    ]);

    // ===== 尺寸变化处理 =====
    const handleResize = useCallback(
      (entries: ResizeObserverEntry[]) => {
        const container = entries[0]?.target as HTMLDivElement;
        if (!container) return;

        const width = container.clientWidth;
        const height = container.clientHeight;

        if (onResize) {
          onResize(width, height);
        }

        throttledCalculateLayout();
      },
      [onResize, throttledCalculateLayout]
    );

    // ===== 挂载时 =====
    useEffect(() => {
      if (onMount) onMount();

      // 初始布局
      calculateLayout();

      // 监听容器尺寸变化
      const container = containerRef.current;
      if (container) {
        resizeObserverRef.current = new ResizeObserver(handleResize);
        resizeObserverRef.current.observe(container);
      }

      return () => {
        if (onUnmount) onUnmount();
        if (resizeObserverRef.current) {
          resizeObserverRef.current.disconnect();
        }
        if (scrollTimerRef.current) {
          window.clearTimeout(scrollTimerRef.current);
        }
        if (layoutTimerRef.current) {
          window.clearTimeout(layoutTimerRef.current);
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ===== items 变化时重新布局 =====
    useEffect(() => {
      throttledCalculateLayout();
    }, [items, throttledCalculateLayout]);

    // ===== columns 变化时重新布局 =====
    useEffect(() => {
      calculateLayout();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [columns]);

    // ===== 暴露方法 =====
    useImperativeHandle(ref, () => ({
      relayout: calculateLayout,
      scrollToItem: (index, options = {}) => {
        const position = itemPositions.get(index);
        if (!position || !containerRef.current) return;

        const container = containerRef.current;
        const offset = options.offset || 0;
        let scrollTop = position.y + offset;

        if (options.block === "center") {
          scrollTop -= container.clientHeight / 2 - position.height / 2;
        } else if (options.block === "end") {
          scrollTop -= container.clientHeight - position.height;
        }

        container.scrollTo({
          top: Math.max(0, scrollTop),
          behavior: options.behavior || "auto",
        });
      },
      scrollToTop: (options = {}) => {
        containerRef.current?.scrollTo({
          top: options.offset || 0,
          behavior: options.behavior || "auto",
        });
      },
      scrollToBottom: (options = {}) => {
        const container = containerRef.current;
        if (!container) return;
        container.scrollTo({
          top:
            container.scrollHeight -
            container.clientHeight +
            (options.offset || 0),
          behavior: options.behavior || "auto",
        });
      },
      getItemPosition: (index) => itemPositions.get(index) || null,
      getAllItemPositions: () => itemPositions,
      getColumnHeights: () => layoutInfo.columnHeights,
      getLayoutInfo: () => layoutInfo,
      getViewportInfo: () => viewportInfo,
      getVisibleItems: () => visibleItems,
      forceUpdate: () => forceUpdateState({}),
      getContainer: () => containerRef.current,
      getItemElement: (index) => itemRefsMap.current.get(index) || null,
      measureItem: async (index) => {
        const element = itemRefsMap.current.get(index);
        if (!element) {
          return { width: 0, height: 0 };
        }
        return {
          width: element.offsetWidth,
          height: element.offsetHeight,
        };
      },
    }));

    // ===== 渲染项 =====
    const renderItems = () => {
      // 虚拟滚动：只渲染可见项
      const itemsToRender = virtual
        ? Array.from(visibleItems)
        : items.map((_, i) => i);

      return itemsToRender.map((index) => {
        const item = items[index];
        if (!item) return null;

        const position = itemPositions.get(index);
        if (!position) return null;

        const key = keyExtractor(item, index);

        const itemPositionStyle: React.CSSProperties = useTransform
          ? {
              position: "absolute",
              transform: `translate(${position.x}px, ${position.y}px)`,
              width: position.width,
              boxSizing: "border-box", // 确保宽度包含 padding 和 border
            }
          : {
              position: "absolute",
              left: position.x,
              top: position.y,
              width: position.width,
              boxSizing: "border-box", // 确保宽度包含 padding 和 border
            };

        return (
          <div
            key={key}
            ref={(el) => {
              if (el) {
                itemRefsMap.current.set(index, el);
                if (onItemMount) onItemMount(index, el);
              } else {
                itemRefsMap.current.delete(index);
                if (onItemUnmount) onItemUnmount(index);
              }
            }}
            style={{
              ...itemPositionStyle,
              ...itemStyle,
            }}
            className={itemClassName}
            onClick={(e) => {
              if (onItemClick) onItemClick(index, item, e);
            }}
            data-index={index}
          >
            {renderItem(item, index)}
          </div>
        );
      });
    };

    // ===== 渲染 =====
    return (
      <div
        ref={containerRef as React.LegacyRef<HTMLDivElement>}
        style={{
          position: "relative",
          overflowX: "hidden", // 禁止横向滚动
          overflowY: "auto", // 允许纵向滚动
          ...containerStyle,
        }}
        className={containerClassName}
        onScroll={handleScroll}
      >
        {/* 占位容器（用于撑开滚动高度） */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: layoutInfo.totalHeight,
            minWidth: 0, // 防止内容撑开容器宽度
          }}
        >
          {renderItems()}
        </div>

        {/* 插件覆盖层 */}
        {children}
      </div>
    );
  }
);

export default WaterfallCore;
