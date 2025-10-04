/**
 * WaterfallPlugin 插件系统导出
 */

// 插件系统显式命名导出（tree-shaking 友好）
export type {
  // 插件系统核心类型
  WaterfallPlugin,
  PluginManager,
  PluginBus,
  WaterfallPluginContext,
  WaterfallPluginHooks,
  PluginCreator,
  // 数据结构类型
  ItemPosition,
  LayoutInfo,
  ViewportInfo,
  ItemVisibility,
  PerformanceMetrics,
  DeviceInfo,
  NetworkInfo,
  AnimationConfig,
  DragInfo,
  // 函数类型
  ItemRenderer,
  ItemKeyExtractor,
  ScrollToOptions,
} from "./types";

export type { WithPluginsConfig } from "./withPlugins";

// 插件系统工具函数
export { createPluginBus } from "./PluginBus";
export { createPluginManager } from "./PluginManager";
export { withPlugins } from "./withPlugins";
