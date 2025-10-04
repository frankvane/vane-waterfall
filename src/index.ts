/**
 * vane-waterfall 库入口文件
 * 用于 npm 包发布时的导出
 */

// ==================== 核心组件导出 ====================
export { WaterfallCore } from "./components/WaterfallPlugin";
export type {
  WaterfallCoreProps,
  WaterfallCoreRef,
  ScrollToOptions,
  ScrollToItemOptions,
} from "./components/WaterfallPlugin";

// ==================== 插件系统显式命名导出（tree-shaking 友好） ====================
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
} from "./components/WaterfallPlugin/plugins";

export { createPluginBus } from "./components/WaterfallPlugin/plugins";
export { createPluginManager } from "./components/WaterfallPlugin/plugins";
export { withPlugins } from "./components/WaterfallPlugin/plugins";

// ==================== 自定义插件统一导出 ====================
// 已在 custom-plugins/index.ts 使用显式命名导出
export * from "./components/WaterfallPlugin/custom-plugins";
