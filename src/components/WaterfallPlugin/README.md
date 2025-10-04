# WaterfallPlugin - 瀑布流插件式组件系统

一个功能强大、高度可扩展的瀑布流布局组件系统，基于插件架构设计，参考 LazyLoadImagePlugin 的架构标准。

## 📁 目录结构

```
WaterfallPlugin/
├── core/
│   └── WaterfallCore.tsx           # 核心瀑布流组件
├── plugins/
│   ├── types.ts                     # 插件类型定义（核心）
│   ├── PluginBus.ts                 # 事件总线
│   ├── PluginManager.ts             # 插件管理器
│   ├── withPlugins.tsx              # HOC 组合器
│   └── index.ts                     # 插件系统导出
├── custom-plugins/
│   └── index.ts                     # 自定义插件导出（待扩展）
├── index.ts                         # 主入口
└── README.md                        # 使用文档
```

## ✨ 核心特性

### 1. 插件式架构

- **完全解耦**: 核心组件只负责布局计算，所有扩展功能通过插件实现
- **灵活扩展**: 支持自定义插件，可实现任意功能
- **生命周期钩子**: 提供完整的生命周期钩子，覆盖布局、滚动、渲染等各个阶段

### 2. 高性能

- **智能布局**: 使用瀑布流算法自动计算最优布局
- **Transform 定位**: 使用 transform 而非 left/top，提升渲染性能
- **节流防抖**: 内置滚动和尺寸变化的节流防抖处理
- **虚拟滚动**: 通过专业插件（如 react-window）实现，保持核心简洁

### 3. 完整的类型支持

- 使用 TypeScript 编写，提供完整的类型定义
- 泛型支持，适配任意数据类型

## 🚀 快速开始

### 基础使用

```tsx
import { WaterfallCore } from "@/components/WaterfallPlugin";

interface Item {
  id: number;
  title: string;
  image: string;
  height: number;
}

function MyWaterfall() {
  const items: Item[] = [
    { id: 1, title: "Item 1", image: "url1", height: 200 },
    { id: 2, title: "Item 2", image: "url2", height: 300 },
    // ...
  ];

  return (
    <WaterfallCore
      items={items}
      columns={3}
      gap={16}
      renderItem={(item, index) => (
        <div style={{ height: item.height }}>
          <img src={item.image} alt={item.title} />
          <h3>{item.title}</h3>
        </div>
      )}
      keyExtractor={(item) => item.id}
      containerStyle={{ height: "100vh" }}
    />
  );
}
```

### 使用插件增强功能

```tsx
import { WaterfallCore, withPlugins } from "@/components/WaterfallPlugin";
import type { WaterfallPlugin } from "@/components/WaterfallPlugin";

// 创建自定义插件
const myPlugin: WaterfallPlugin = {
  name: "my-plugin",
  version: "1.0.0",
  hooks: {
    onMount: (context) => {
      console.log("Waterfall mounted", context);
    },
    onLayoutComplete: (context) => {
      console.log("Layout complete", context.layout);
    },
    onReachBottom: async (context, distance) => {
      console.log("Reached bottom, distance:", distance);
      // 加载更多数据
    },
  },
};

// 使用插件包装组件
const WaterfallWithPlugins = withPlugins(WaterfallCore, [myPlugin]);

function MyEnhancedWaterfall() {
  return (
    <WaterfallWithPlugins
      items={items}
      columns={3}
      gap={16}
      renderItem={(item) => <div>{item.title}</div>}
    />
  );
}
```

## 📚 API 文档

### WaterfallCore Props

| 属性                 | 类型                                           | 默认值        | 说明                    |
| -------------------- | ---------------------------------------------- | ------------- | ----------------------- |
| `items`              | `T[]`                                          | **必填**      | 数据源                  |
| `renderItem`         | `(item: T, index: number) => ReactNode`        | **必填**      | 项渲染函数              |
| `keyExtractor`       | `(item: T, index: number) => string \| number` | `(_, i) => i` | 键提取函数              |
| `columns`            | `number`                                       | `3`           | 列数                    |
| `gap`                | `number`                                       | `16`          | 间距（px）              |
| `rowGap`             | `number`                                       | `gap`         | 行间距                  |
| `columnGap`          | `number`                                       | `gap`         | 列间距                  |
| `padding`            | `number \| PaddingObject`                      | `0`           | 容器内边距              |
| `useTransform`       | `boolean`                                      | `true`        | 是否使用 transform 定位 |
| `containerStyle`     | `CSSProperties`                                | -             | 容器样式                |
| `containerClassName` | `string`                                       | -             | 容器类名                |
| `itemStyle`          | `CSSProperties`                                | -             | 项样式                  |
| `itemClassName`      | `string`                                       | -             | 项类名                  |
| `debug`              | `boolean`                                      | `false`       | 是否启用调试模式        |

### WaterfallCore Ref 方法

```tsx
const ref = useRef<WaterfallCoreRef>(null);

// 重新计算布局
ref.current?.relayout();

// 滚动到指定项
ref.current?.scrollToItem(10, { behavior: "smooth", block: "center" });

// 滚动到顶部
ref.current?.scrollToTop({ behavior: "smooth" });

// 滚动到底部
ref.current?.scrollToBottom();

// 获取布局信息
const layoutInfo = ref.current?.getLayoutInfo();

// 获取可见项
const visibleItems = ref.current?.getVisibleItems();
```

## 🔌 插件开发

### 插件结构

```typescript
import type {
  WaterfallPlugin,
  WaterfallPluginContext,
} from "@/components/WaterfallPlugin";

export const myPlugin: WaterfallPlugin = {
  // 插件基本信息
  name: "my-plugin",
  version: "1.0.0",
  description: "我的插件",

  // 插件配置
  config: {
    option1: true,
    option2: "value",
  },

  // 依赖其他插件
  dependencies: ["other-plugin"],

  // 优先级（数字越大优先级越高）
  priority: 10,

  // 插件钩子
  hooks: {
    // 生命周期钩子
    onMount: (context) => {
      console.log("插件挂载");
      // 返回清理函数
      return () => {
        console.log("插件卸载");
      };
    },

    // 布局钩子
    onBeforeLayout: (context) => {
      // 返回 false 可以阻止布局
      return true;
    },

    onLayoutComplete: (context) => {
      console.log("布局完成", context.layout);
    },

    // 滚动钩子
    onScroll: (context, scrollTop, scrollLeft) => {
      console.log("滚动中", scrollTop);
    },

    onReachBottom: async (context, distance) => {
      console.log("到达底部，距离:", distance);
    },

    // 项生命周期钩子
    onItemEnterViewport: (context, index, visibility) => {
      console.log("项进入视口", index, visibility);
    },

    // 渲染钩子
    renderOverlay: (context) => {
      return <div>自定义覆盖层</div>;
    },
  },

  // 插件初始化
  init: async () => {
    console.log("插件初始化");
  },

  // 插件销毁
  destroy: async () => {
    console.log("插件销毁");
  },
};
```

### 插件上下文

插件钩子函数会接收到 `WaterfallPluginContext` 对象，包含以下信息：

```typescript
interface WaterfallPluginContext<T> {
  // 基础数据
  items: T[];
  itemCount: number;

  // DOM 引用
  containerRef: RefObject<HTMLDivElement>;
  itemRefs: Map<number, HTMLElement>;
  getItemRef: (index: number) => HTMLElement | null;

  // 布局信息
  layout: LayoutInfo;
  itemPositions: Map<number, ItemPosition>;
  getItemPosition: (index: number) => ItemPosition | null;

  // 视口信息
  viewport: ViewportInfo;
  visibleItems: Set<number>;
  visibleRange: { start: number; end: number };

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

  // 工具方法
  relayout: () => void;
  scrollToItem: (index: number, options?: ScrollToOptions) => void;
  scrollToTop: (options?: ScrollToOptions) => void;
  scrollToBottom: (options?: ScrollToOptions) => void;
  measureItem: (index: number) => Promise<{ width: number; height: number }>;
  forceUpdate: () => void;
}
```

### 插件通信

插件之间可以通过 `PluginBus` 进行通信：

```typescript
const myPlugin: WaterfallPlugin = {
  name: "producer-plugin",
  hooks: {
    onMount: (context) => {
      // 发送事件
      context.bus?.emit("custom-event", { data: "hello" });

      // 设置共享数据
      context.bus?.setData("shared-key", "shared-value");
    },
  },
};

const otherPlugin: WaterfallPlugin = {
  name: "consumer-plugin",
  hooks: {
    onMount: (context) => {
      // 订阅事件
      const unsubscribe = context.bus?.on("custom-event", (data) => {
        console.log("收到事件", data);
      });

      // 获取共享数据
      const value = context.bus?.getData("shared-key");

      // 返回清理函数
      return () => {
        unsubscribe?.();
      };
    },
  },
};
```

## 🎨 常见插件示例

### 响应式列数插件

```typescript
const responsiveColumnsPlugin: WaterfallPlugin = {
  name: "responsive-columns",
  hooks: {
    calculateColumns: (context) => {
      const width = context.containerRef.current?.clientWidth || 0;
      if (width < 768) return 1;
      if (width < 1024) return 2;
      if (width < 1440) return 3;
      return 4;
    },
  },
};
```

### 无限滚动插件

```typescript
const infiniteScrollPlugin: WaterfallPlugin = {
  name: "infinite-scroll",
  config: { threshold: 100 },
  hooks: {
    onReachBottom: async (context, distance) => {
      if (!context.isLoading && context.hasMore) {
        // 触发加载更多
        context.bus?.emit("load-more");
      }
    },
  },
};
```

### 动画插件

```typescript
const animationPlugin: WaterfallPlugin = {
  name: "animation",
  hooks: {
    onItemMount: (context, index, element) => {
      element.style.opacity = "0";
      element.style.transform = "translateY(20px)";

      requestAnimationFrame(() => {
        element.style.transition = "all 0.3s ease";
        element.style.opacity = "1";
        element.style.transform = "translateY(0)";
      });
    },
  },
};
```

## 🔧 进阶用法

### 自定义布局算法

```typescript
const customLayoutPlugin: WaterfallPlugin = {
  name: "custom-layout",
  hooks: {
    calculateItemPosition: (context, index, itemHeight) => {
      // 自定义位置计算逻辑
      // 返回 ItemPosition 或 undefined 使用默认逻辑
    },
  },
};
```

### 性能监控

```typescript
const performancePlugin: WaterfallPlugin = {
  name: "performance-monitor",
  hooks: {
    onLayoutComplete: (context) => {
      if (context.performanceMetrics) {
        console.log("布局耗时:", context.performanceMetrics.layoutDuration);
      }
    },
  },
};
```

## 📝 注意事项

1. **项高度**: 为获得最佳性能，建议在数据中包含项的高度信息，避免依赖 DOM 测量
2. **插件顺序**: 插件按优先级执行，相同优先级按注册顺序执行
3. **虚拟滚动**: 如需虚拟滚动功能，建议使用专业插件（如 react-window）实现
4. **内存管理**: 大量数据时建议通过虚拟滚动插件优化性能

## 🛠 未来计划

### 自定义插件开发

- [ ] **VirtualScrollPlugin** - 基于 react-window 的虚拟滚动插件（高性能，适合大数据量）
- [ ] **ResponsiveColumnsPlugin** - 响应式列数插件（根据屏幕宽度自动调整列数）
- [ ] **InfiniteScrollPlugin** - 无限滚动插件（滚动到底部自动加载更多）
- [ ] **AnimationPlugin** - 项动画插件（淡入、缩放等动画效果）
- [ ] **SortablePlugin** - 拖拽排序插件（支持项拖拽重排）
- [ ] **SelectionPlugin** - 多选插件（支持多选和批量操作）
- [ ] **FilterPlugin** - 筛选插件（支持动态筛选和排序）
- [ ] **LazyLoadPlugin** - 懒加载插件（延迟加载图片等资源）

### 文档和示例

- [ ] 添加插件开发指南
- [ ] 添加虚拟滚动插件使用示例
- [ ] 添加更多实际场景示例（图片墙、卡片列表等）
- [ ] 完善 API 文档

## 📄 License

MIT
