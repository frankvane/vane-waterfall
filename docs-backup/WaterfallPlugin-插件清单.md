# WaterfallPlugin 插件清单与路线图

> 位置：`src/components/WaterfallPlugin/custom-plugins/`

## 已开发插件（当前代码库已存在实现）
- AlignmentPlugin（列分配策略）：`Alignment/`
- ResponsiveColumnsPlugin（响应式列数）：`ResponsiveColumns/`
- AutoColumnPlugin（自动列数）：`AutoColumn/`
- FixedHeightPlugin（统一项高度）：`FixedHeight/`
- GapPlugin（动态间距）：`Gap/`
- ThrottlePlugin（滚动/Resize 节流）：`Throttle/`
- DebounceLayoutPlugin（布局防抖）：`DebounceLayout/`
- RecyclePlugin（DOM 回收复用）：`Recycle/`
- InfiniteScrollPlugin（到底部加载更多）：`InfiniteScroll/`
- PaginationPlugin（分页切片）：`Pagination/`
  - 支持翻页后自动回顶（`scrollToTop`、`scrollBehavior` 配置；或组件级 `scrollToTopOnPageChange` 覆盖）
- FilterPlugin（筛选）：`Filter/`
  - 支持筛选条件变化回顶（`scrollToTop`、`scrollBehavior`；或组件级 `scrollToTopOnFilterChange` 覆盖）
- SortPlugin（排序）：`Sort/`
  - 支持排序条件变化回顶（`scrollToTop`、`scrollBehavior`；或组件级 `scrollToTopOnSortChange` 覆盖）
- SearchPlugin（搜索）：`Search/`
  - 支持搜索条件变化回顶（`scrollToTop`、`scrollBehavior`；或组件级 `scrollToTopOnSearchChange` 覆盖）
- VirtualWaterfallPlugin（虚拟瀑布流）：`VirtualWaterfall/`
- GroupingPlugin（分组与区段标题）：`Grouping/`
- StickyHeaderPlugin（区块/导航吸顶）：`StickyHeader/`
- ScrollAnchorPlugin（滚动锚点）：`ScrollAnchor/`
- DragReorderPlugin（拖拽重新排序并增量重排布局）：`DragReorder/`
- ClickAnalyticsPlugin（点击分析）：`ClickAnalytics/`
- BookmarkPlugin（位置记忆/书签）：`Bookmark/`
- StatePersistencePlugin（状态快照与恢复：返回保留滚动与布局）：`StatePersistence/`
- URLSyncPlugin（URL 状态同步：分页/筛选/排序/搜索）：`URLSync/`

## 待开发瀑布流插件（建议优先级可根据需求调整）
- BatchRenderPlugin（批量渲染）：`BatchRender/`（待补充实现）
- CachePlugin（布局缓存）：`Cache/`（待补充实现）
- PerformanceMonitorPlugin（性能监控）
- ViewportTrackingPlugin（可见性追踪）
- ScrollDepthPlugin（滚动深度）
- ErrorTrackingPlugin（错误追踪）
- TransitionPlugin（布局变化过渡）
- KeyboardNavigationPlugin（键盘导航）
- TouchGesturePlugin（触摸手势）
- SharePlugin（分享）
- A11yPlugin（可访问性增强）
- AnnouncerPlugin（屏幕阅读器播报）
- ReducedMotionPlugin（减少动画，尊重系统偏好）

### 更多可开发插件（扩展）
- PinItemPlugin（项目置顶/固定在视口顶部或指定列）：`PinItem/`
- RTLLayoutPlugin（从右到左布局支持与镜像渲染）：`RTLLayout/`
- OverscanAdaptivePlugin（按滚动速度/设备性能自适应 overscan）：`OverscanAdaptive/`
- WorkerLayoutPlugin（将布局计算迁移至 WebWorker，主线程更流畅）：`WorkerLayout/`
- IdleLayoutPlugin（使用 requestIdleCallback/调度在空闲时间布局）：`IdleLayout/`
- PriorityRenderPlugin（优先渲染可见/高权重项，降低首屏时间）：`PriorityRender/`
- DevToolsOverlayPlugin（开发调试叠层：网格线/列高度/可见范围）：`DevToolsOverlay/`
- PluginInspectorPlugin（插件依赖与执行顺序检查、调试面板）：`PluginInspector/`
- SSRHydrationPlugin（SSR 首屏预布局与 Hydration 对齐）：`SSRHydration/`
- ExportLayoutPlugin（导出布局数据/快照接口，便于分析与回放）：`ExportLayout/`
- PageVisibilityPlugin（页面不可见时暂停监听与降级策略）：`PageVisibility/`
- ScrollSnapPlugin（滚动捕捉：对齐到行或分组边界）：`ScrollSnap/`
- HeatmapAnalyticsPlugin（点击/曝光热力分析，与可见性追踪联动）：`HeatmapAnalytics/`

## 由 vane-lazy-image 提供或更适合在图片插件层实现的能力（瀑布流内不重复实现）
- HoverEffectPlugin（悬停效果）
- ParallaxPlugin（视差效果）
- SkeletonPlugin（骨架屏）
- LoadingPlugin（加载状态）
- WatermarkPlugin（水印）
- BlurUpPlugin（模糊过渡）
- RetryOnErrorPlugin（加载重试）
- 以及其他与图片渲染相关的特效与加载策略

## 统一用法约定
- 通过 `withPlugins(WaterfallCore, [...])` 组合插件。
- 插件修改核心行为通过 `transformProps` 与生命周期钩子（如 `onPropsChange`、`onResize`）实现。
- 支持“插件配置 + 组件级覆盖”两层控制（如分页/筛选/排序/搜索的条件变化自动回顶）。

## 维护说明
- 本清单用于跟踪瀑布流插件生态。新插件的需求、状态（已开发/待开发/移交图片插件层）请在此文档更新。
- 与 `vane-lazy-image` 的集成项统一标注在“图片插件层”，避免在瀑布流组件内重复实现。