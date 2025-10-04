/**
 * WaterfallPlugin 插件系统类型定义
 * 参考 LazyLoadImagePlugin 架构设计
 */

import type React from "react";
import type { WaterfallCoreProps } from "../core/WaterfallCore";

// ============ 基础数据类型 ============

/**
 * 瀑布流项的位置信息
 */
export interface ItemPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  column: number; // 所属列
  row: number; // 所属行（虚拟行概念）
}

/**
 * 布局信息
 */
export interface LayoutInfo {
  columns: number; // 当前列数
  columnWidth: number; // 列宽
  gap: number; // 间距
  columnHeights: number[]; // 每列的高度
  totalHeight: number; // 总高度
  containerWidth: number; // 容器宽度
  containerHeight: number; // 容器高度
}

/**
 * 视口信息
 */
export interface ViewportInfo {
  scrollTop: number;
  scrollLeft: number;
  scrollHeight: number;
  scrollWidth: number;
  clientHeight: number;
  clientWidth: number;
  isScrolling: boolean;
  direction: "up" | "down" | "left" | "right" | null;
}

/**
 * 项可见性信息
 */
export interface ItemVisibility {
  index: number;
  isVisible: boolean;
  visibleRatio: number; // 0-1
  isAboveViewport: boolean;
  isBelowViewport: boolean;
}

/**
 * 性能指标
 */
export interface PerformanceMetrics {
  // 布局相关
  layoutStartTime: number;
  layoutEndTime?: number;
  layoutDuration?: number;
  layoutCount: number;

  // 渲染相关
  renderStartTime?: number;
  renderEndTime?: number;
  renderDuration?: number;
  renderedItemCount: number;

  // 滚动相关
  scrollStartTime?: number;
  scrollEndTime?: number;
  scrollDuration?: number;
  scrollDistance?: number;

  // 内存相关
  itemCount: number;
  visibleItemCount: number;
  memoryUsage?: number;
}

/**
 * 设备信息
 */
export interface DeviceInfo {
  type: "mobile" | "tablet" | "desktop";
  os: string;
  browser: string;
  devicePixelRatio: number;
  viewportWidth: number;
  viewportHeight: number;
  isTouchDevice: boolean;
  isRetina: boolean;
}

/**
 * 网络信息
 */
export interface NetworkInfo {
  effectiveType: "4g" | "3g" | "2g" | "slow-2g";
  downlink: number; // Mbps
  rtt: number; // ms
  saveData: boolean;
  online: boolean;
}

/**
 * 动画配置
 */
export interface AnimationConfig {
  duration: number;
  delay?: number;
  easing?: string;
  stagger?: number; // 交错延迟
}

/**
 * 拖拽信息
 */
export interface DragInfo {
  isDragging: boolean;
  draggedIndex: number | null;
  dragStartX: number;
  dragStartY: number;
  dragCurrentX: number;
  dragCurrentY: number;
  dropTargetIndex: number | null;
}

// ============ 插件通信总线 ============

export interface PluginBus {
  // 事件发布订阅
  emit: <T = any>(event: string, data?: T) => void;
  on: <T = any>(event: string, handler: (data: T) => void) => () => void;
  once: <T = any>(event: string, handler: (data: T) => void) => () => void;
  off: (event: string, handler?: (data: any) => void) => void;

  // 数据共享
  getData: <T = any>(key: string) => T | undefined;
  setData: <T = any>(key: string, value: T) => void;
  deleteData: (key: string) => void;
  hasData: (key: string) => boolean;

  // 批量操作
  getAll: () => Record<string, any>;
  clear: () => void;
}

// ============ 插件上下文 ============

export interface WaterfallPluginContext<T = any> {
  // 基础数据
  items: T[];
  itemCount: number;

  // DOM 引用
  containerRef: React.RefObject<HTMLDivElement | null>;
  itemRefs: Map<number, HTMLElement>;
  getItemRef: (index: number) => HTMLElement | null;

  // 布局信息
  layout: LayoutInfo;
  itemPositions: Map<number, ItemPosition>;
  getItemPosition: (index: number) => ItemPosition | null;

  // 视口信息
  viewport: ViewportInfo;
  visibleItems: Set<number>; // 当前可见的项索引集合
  visibleRange: { start: number; end: number }; // 可见范围

  // 状态
  isLayouting: boolean;
  isScrolling: boolean;
  isDragging: boolean;
  isLoading: boolean;
  hasMore: boolean;
  error: Error | null;

  // 配置
  props: WaterfallCoreProps<T>;

  // 插件通信
  bus?: PluginBus;
  sharedData?: Map<string, any>;

  // 扩展信息
  deviceInfo?: DeviceInfo;
  networkInfo?: NetworkInfo;
  performanceMetrics?: PerformanceMetrics;
  dragInfo?: DragInfo;

  // 工具方法
  relayout: () => void;
  scrollToItem: (index: number, options?: ScrollToOptions) => void;
  scrollToTop: (options?: ScrollToOptions) => void;
  scrollToBottom: (options?: ScrollToOptions) => void;
  measureItem: (index: number) => Promise<{ width: number; height: number }>;
  forceUpdate: () => void;
}

export interface ScrollToOptions {
  behavior?: "auto" | "smooth";
  block?: "start" | "center" | "end" | "nearest";
  inline?: "start" | "center" | "end" | "nearest";
}

// ============ 插件钩子定义 ============

export interface WaterfallPluginHooks<T = any> {
  // ========== 生命周期钩子 ==========

  /**
   * 组件挂载时触发
   * @returns 清理函数（可选）
   */
  onMount?: (context: WaterfallPluginContext<T>) => void | (() => void);

  /**
   * 组件卸载时触发
   */
  onUnmount?: (context: WaterfallPluginContext<T>) => void;

  /**
   * Props 变化时触发
   */
  onPropsChange?: (
    context: WaterfallPluginContext<T>,
    prevProps: WaterfallCoreProps<T>,
    nextProps: WaterfallCoreProps<T>
  ) => void;

  // ========== 布局钩子 ==========

  /**
   * 布局开始前触发
   * @returns false 可以阻止布局
   */
  onBeforeLayout?: (
    context: WaterfallPluginContext<T>
  ) => boolean | Promise<boolean>;

  /**
   * 布局计算中触发（可以修改布局逻辑）
   */
  onLayout?: (context: WaterfallPluginContext<T>) => void;

  /**
   * 布局完成后触发
   */
  onLayoutComplete?: (context: WaterfallPluginContext<T>) => void;

  /**
   * 计算列数（响应式插件会实现此钩子）
   * @returns 列数，undefined 表示使用默认值
   */
  calculateColumns?: (context: WaterfallPluginContext<T>) => number | undefined;

  /**
   * 计算列宽（自定义列宽插件会实现）
   */
  calculateColumnWidth?: (
    context: WaterfallPluginContext<T>,
    containerWidth: number,
    columns: number
  ) => number | undefined;

  /**
   * 计算项位置（自定义布局算法插件会实现）
   */
  calculateItemPosition?: (
    context: WaterfallPluginContext<T>,
    index: number,
    itemHeight: number
  ) => ItemPosition | undefined;

  // ========== 项生命周期钩子 ==========

  /**
   * 项挂载时触发
   */
  onItemMount?: (
    context: WaterfallPluginContext<T>,
    index: number,
    element: HTMLElement
  ) => void;

  /**
   * 项卸载时触发
   */
  onItemUnmount?: (context: WaterfallPluginContext<T>, index: number) => void;

  /**
   * 项进入视口时触发
   */
  onItemEnterViewport?: (
    context: WaterfallPluginContext<T>,
    index: number,
    visibility: ItemVisibility
  ) => void;

  /**
   * 项离开视口时触发
   */
  onItemLeaveViewport?: (
    context: WaterfallPluginContext<T>,
    index: number,
    visibility: ItemVisibility
  ) => void;

  /**
   * 项可见性变化时触发
   */
  onItemVisibilityChange?: (
    context: WaterfallPluginContext<T>,
    index: number,
    visibility: ItemVisibility
  ) => void;

  /**
   * 项点击时触发
   */
  onItemClick?: (
    context: WaterfallPluginContext<T>,
    index: number,
    item: T,
    event: React.MouseEvent
  ) => void;

  // ========== 滚动钩子 ==========

  /**
   * 滚动开始时触发
   */
  onScrollStart?: (context: WaterfallPluginContext<T>) => void;

  /**
   * 滚动中触发
   */
  onScroll?: (
    context: WaterfallPluginContext<T>,
    scrollTop: number,
    scrollLeft: number
  ) => void;

  /**
   * 滚动结束时触发
   */
  onScrollEnd?: (context: WaterfallPluginContext<T>) => void;

  /**
   * 滚动到底部时触发（用于无限滚动）
   */
  onReachBottom?: (
    context: WaterfallPluginContext<T>,
    distance: number
  ) => void | Promise<void>;

  /**
   * 滚动到顶部时触发
   */
  onReachTop?: (context: WaterfallPluginContext<T>) => void;

  // ========== 尺寸变化钩子 ==========

  /**
   * 容器尺寸变化时触发
   */
  onResize?: (
    context: WaterfallPluginContext<T>,
    width: number,
    height: number
  ) => void;

  /**
   * 项尺寸变化时触发
   */
  onItemResize?: (
    context: WaterfallPluginContext<T>,
    index: number,
    width: number,
    height: number
  ) => void;

  // ========== 数据钩子 ==========

  /**
   * 数据变化前触发
   * @returns false 可以阻止数据更新
   */
  onBeforeItemsChange?: (
    context: WaterfallPluginContext<T>,
    oldItems: T[],
    newItems: T[]
  ) => boolean | Promise<boolean>;

  /**
   * 数据变化后触发
   */
  onItemsChange?: (
    context: WaterfallPluginContext<T>,
    oldItems: T[],
    newItems: T[]
  ) => void;

  /**
   * 单个项数据变化时触发
   */
  onItemChange?: (
    context: WaterfallPluginContext<T>,
    index: number,
    oldItem: T,
    newItem: T
  ) => void;

  /**
   * 加载更多数据时触发（无限滚动插件会实现）
   */
  onLoadMore?: (
    context: WaterfallPluginContext<T>,
    page: number
  ) => Promise<T[]> | T[] | void;

  /**
   * 刷新数据时触发（下拉刷新插件会实现）
   */
  onRefresh?: (context: WaterfallPluginContext<T>) => Promise<T[]> | T[] | void;

  // ========== 交互钩子 ==========

  /**
   * 拖拽开始时触发
   */
  onDragStart?: (
    context: WaterfallPluginContext<T>,
    index: number,
    event: React.DragEvent
  ) => void;

  /**
   * 拖拽中触发
   */
  onDrag?: (
    context: WaterfallPluginContext<T>,
    index: number,
    event: React.DragEvent
  ) => void;

  /**
   * 拖拽结束时触发
   */
  onDragEnd?: (
    context: WaterfallPluginContext<T>,
    index: number,
    event: React.DragEvent
  ) => void;

  /**
   * 项被拖放时触发
   */
  onDrop?: (
    context: WaterfallPluginContext<T>,
    fromIndex: number,
    toIndex: number
  ) => void;

  /**
   * 项被选中时触发
   */
  onItemSelect?: (
    context: WaterfallPluginContext<T>,
    index: number,
    item: T,
    selected: boolean
  ) => void;

  /**
   * 多选变化时触发
   */
  onSelectionChange?: (
    context: WaterfallPluginContext<T>,
    selectedIndices: Set<number>
  ) => void;

  // ========== 筛选与排序钩子 ==========

  /**
   * 筛选逻辑（筛选插件会实现）
   */
  filterItem?: (
    context: WaterfallPluginContext<T>,
    item: T,
    index: number
  ) => boolean;

  /**
   * 排序逻辑（排序插件会实现）
   */
  sortItems?: (context: WaterfallPluginContext<T>, items: T[]) => T[];

  /**
   * 搜索逻辑（搜索插件会实现）
   */
  searchItem?: (
    context: WaterfallPluginContext<T>,
    item: T,
    query: string
  ) => boolean;

  // ========== 性能钩子 ==========

  /**
   * 性能指标收集
   */
  onPerformanceMetric?: (
    context: WaterfallPluginContext<T>,
    metrics: PerformanceMetrics
  ) => void;

  /**
   * 虚拟滚动范围计算（虚拟滚动插件会实现）
   */
  calculateVisibleRange?: (
    context: WaterfallPluginContext<T>
  ) => { start: number; end: number } | undefined;

  // ========== 错误钩子 ==========

  /**
   * 错误发生时触发
   */
  onError?: (
    context: WaterfallPluginContext<T>,
    error: Error,
    errorInfo?: React.ErrorInfo
  ) => void;

  /**
   * 项加载失败时触发
   */
  onItemLoadError?: (
    context: WaterfallPluginContext<T>,
    index: number,
    error: Error
  ) => void;

  // ========== 渲染钩子 ==========

  /**
   * 自定义容器渲染
   */
  renderContainer?: (
    context: WaterfallPluginContext<T>,
    children: React.ReactNode
  ) => React.ReactNode;

  /**
   * 自定义项包装器渲染
   */
  renderItemWrapper?: (
    context: WaterfallPluginContext<T>,
    index: number,
    item: T,
    children: React.ReactNode
  ) => React.ReactNode;

  /**
   * 自定义覆盖层渲染（加载状态、空状态等）
   */
  renderOverlay?: (context: WaterfallPluginContext<T>) => React.ReactNode;

  /**
   * 自定义加载更多指示器
   */
  renderLoadingMore?: (context: WaterfallPluginContext<T>) => React.ReactNode;

  /**
   * 自定义空状态
   */
  renderEmpty?: (context: WaterfallPluginContext<T>) => React.ReactNode;

  /**
   * 自定义错误状态
   */
  renderError?: (
    context: WaterfallPluginContext<T>,
    error: Error
  ) => React.ReactNode;

  // ========== Props 转换钩子 ==========

  /**
   * 转换 Props（可以在组件接收 props 前修改）
   */
  transformProps?: (props: WaterfallCoreProps<T>) => WaterfallCoreProps<T>;

  /**
   * 转换项数据（可以在渲染前修改项数据）
   */
  transformItem?: (
    context: WaterfallPluginContext<T>,
    item: T,
    index: number
  ) => T;
}

// ============ 插件定义 ============

export interface WaterfallPlugin<T = any> {
  /**
   * 插件名称（唯一标识）
   */
  name: string;

  /**
   * 插件版本
   */
  version?: string;

  /**
   * 插件描述
   */
  description?: string;

  /**
   * 插件钩子
   */
  hooks: WaterfallPluginHooks<T>;

  /**
   * 插件配置
   */
  config?: Record<string, any>;

  /**
   * 插件依赖（需要先加载的插件名称）
   */
  dependencies?: string[];

  /**
   * 插件优先级（数字越大优先级越高）
   */
  priority?: number;

  /**
   * 插件初始化
   */
  init?: () => void | Promise<void>;

  /**
   * 插件销毁
   */
  destroy?: () => void | Promise<void>;

  /**
   * 插件是否启用
   */
  enabled?: boolean;
}

// ============ 插件管理器 ============

export interface PluginManager<T = any> {
  /**
   * 注册插件
   */
  register: (plugin: WaterfallPlugin<T>) => void;

  /**
   * 批量注册插件
   */
  registerAll: (plugins: WaterfallPlugin<T>[]) => void;

  /**
   * 注销插件
   */
  unregister: (pluginName: string) => void;

  /**
   * 获取插件
   */
  getPlugin: (pluginName: string) => WaterfallPlugin<T> | undefined;

  /**
   * 获取所有插件
   */
  getAllPlugins: () => WaterfallPlugin<T>[];

  /**
   * 获取启用的插件
   */
  getEnabledPlugins: () => WaterfallPlugin<T>[];

  /**
   * 启用插件
   */
  enablePlugin: (pluginName: string) => void;

  /**
   * 禁用插件
   */
  disablePlugin: (pluginName: string) => void;

  /**
   * 检查插件是否已注册
   */
  hasPlugin: (pluginName: string) => boolean;

  /**
   * 执行钩子
   */
  executeHook: <K extends keyof WaterfallPluginHooks<T>>(
    hookName: K,
    context: WaterfallPluginContext<T>,
    ...args: any[]
  ) => Promise<any>;

  /**
   * 清空所有插件
   */
  clear: () => void;
}

// ============ 工具类型 ============

/**
 * 插件创建器类型
 */
export type PluginCreator<T = any, Config = any> = (
  config?: Config
) => WaterfallPlugin<T>;

/**
 * 项渲染函数类型
 */
export type ItemRenderer<T = any> = (
  item: T,
  index: number,
  context: WaterfallPluginContext<T>
) => React.ReactNode;

/**
 * 项键提取函数类型
 */
export type ItemKeyExtractor<T = any> = (
  item: T,
  index: number
) => string | number;
