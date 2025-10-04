/**
 * WaterfallPlugin 系统入口
 */

// 核心组件显式导出
export { default as WaterfallCore } from "./core/WaterfallCore";
export type {
  WaterfallCoreProps,
  WaterfallCoreRef,
  ScrollToOptions,
  ScrollToItemOptions,
} from "./core/WaterfallCore";

// 插件系统显式命名导出（tree-shaking 友好）
export type {
  WaterfallPlugin,
  PluginManager,
  PluginBus,
  WaterfallPluginContext,
  WaterfallPluginHooks,
  PluginCreator,
  WithPluginsConfig,
  ItemPosition,
  LayoutInfo,
  ViewportInfo,
  ItemVisibility,
  PerformanceMetrics,
  DeviceInfo,
  NetworkInfo,
  AnimationConfig,
  DragInfo,
  ItemRenderer,
  ItemKeyExtractor,
} from "./plugins";

export { createPluginBus } from "./plugins";
export { createPluginManager } from "./plugins";
export { withPlugins } from "./plugins";

// 自定义插件统一导出（已在 custom-plugins/index.ts 使用显式命名导出）
export * from "./custom-plugins";
