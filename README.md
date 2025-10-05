# 🧱 Vane Waterfall

一个功能强大、高度可扩展的 React 瀑布流布局插件式组件库（WaterfallPlugin）

[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.x-blue)](https://reactjs.org/)

[在线演示](https://chinavane.netlify.app/) | [快速开始](#快速开始) | [插件列表](#插件列表) | [API 文档](#api-文档)

---

## ✨ 核心特性

### 🔌 插件化架构

- 基于事件总线的插件系统，支持灵活组合
- 60+ 内置插件，覆盖各种使用场景
- 易于扩展，支持自定义插件开发（如 `calculateItemPosition` 覆盖布局）

### 🧱 布局与渲染

- 多种列分配策略：最矮列、平均列、固定列数、响应式列数
- 支持列间距 `gap` 与容器内边距 `padding`，保证两侧留白参与布局计算
- 过渡动画、固定高度、虚拟化渲染、工作线程布局等

### ⚡ 性能优化

- 布局防抖/节流
- 复用与回收（Recycle）
- 虚拟化（VirtualWaterfall）

### 🛡️ 稳健性

- 书签定位、滚动锚点、粘性头部
- 状态持久化与 URL 同步

### ♿ 可访问性与易用性

- A11y 增强、简洁 API、完善的示例

### 📊 监控与分析

- 热力图/交互分析、滚动性能采集（示例插件）

---

## 📦 安装

### NPM / Yarn / PNPM（作为工程示例运行）

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 本地开发

启动后访问：`http://localhost:3000`。

---

## 📊 包大小与优化

### 模块大小（示意）

| 模块       | 原始大小 | Gzip 后 | 说明                                |
| ---------- | -------- | ------- | ----------------------------------- |
| 核心组件   | ~10 KB   | ~3 KB   | `WaterfallCore` 仅包含基础布局逻辑  |
| 插件系统   | ~12 KB   | ~4 KB   | 插件管理器 + 事件总线               |
| 单个插件   | ~2-5 KB  | ~1-2 KB | 每个插件平均大小                    |
| 完整插件组 | ~80+ KB  | ~25 KB  | 包含常用插件的组合示例              |

> 💡 提示：使用按需导入与插件精简组合，可显著降低打包体积。

### Tree-Shaking 支持

本库完全支持 **Tree-Shaking**，未使用的插件不会被打包到最终产物中。

#### 为什么支持 Tree-Shaking？

1. ESM 模块发布，便于静态分析
2. 无副作用标记：`"sideEffects": false`
3. 命名导出，便于按需引用
4. 插件均为独立模块，可单独引入

```json
{
  "sideEffects": false,
  "module": "dist/index.es.js",
  "exports": {
    ".": {
      "import": "./dist/index.es.js",
      "types": "./dist/index.d.ts"
    }
  }
}
```

#### ✅ 支持 Tree-Shaking 的导入方式

```tsx
import {
  WaterfallCore,
  withPlugins,
  createAlignmentPlugin,
  createTransitionPlugin,
} from "@/components/WaterfallPlugin";

const Waterfall = withPlugins(WaterfallCore, [
  createAlignmentPlugin({ mode: "shortest" }),
  createTransitionPlugin({ duration: 180 }),
]);
```

#### ⚠️ 不推荐的导入方式

```tsx
// ❌ 不推荐：一次性导入所有插件（会失去 Tree-Shaking 优势）
import * as Waterfall from "@/components/WaterfallPlugin";
```

### 按需导入示例

#### 方式一：精确导入（最小体积）

```tsx
import { WaterfallCore } from "@/components/WaterfallPlugin";
import { withPlugins } from "@/components/WaterfallPlugin";
import { createAlignmentPlugin } from "@/components/WaterfallPlugin/custom-plugins/Alignment";
import { createTransitionPlugin } from "@/components/WaterfallPlugin/custom-plugins/Transition";
```

#### 方式二：分类导入（推荐）

```tsx
import {
  WaterfallCore,
  withPlugins,
  createAutoColumnPlugin,
  createResponsiveColumnsPlugin,
} from "@/components/WaterfallPlugin";
```

#### 方式三：分组导入

```tsx
import {
  createAlignmentPlugin,
  createFixedHeightPlugin,
  createGapPlugin,
} from "@/components/WaterfallPlugin";
```

### 不同场景的包大小对比（示意）

| 使用场景       | 导入插件数 | 预估大小（Gzip） |
| -------------- | ---------- | ---------------- |
| 最小化（仅核心） | 0          | ~3 KB            |
| 基础使用       | 2-3 个     | ~8-12 KB         |
| 常规项目       | 5-8 个     | ~15-25 KB        |
| 功能丰富       | 10-15 个   | ~30-45 KB        |

### 打包优化建议

#### 1. 使用动态导入

```tsx
const Waterfall = withPlugins(WaterfallCore, [createTransitionPlugin()]);

async function loadAdvancedPlugins() {
  const { createVirtualWaterfallPlugin } = await import(
    "@/components/WaterfallPlugin/custom-plugins/VirtualWaterfall"
  );
  return [createVirtualWaterfallPlugin()];
}
```

#### 2. Vite 配置优化

```ts
// vite.config.ts（示例）
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          waterfall: ["@/components/WaterfallPlugin"],
        },
      },
    },
  },
};
```

#### 3. Webpack 配置优化

```js
module.exports = {
  optimization: {
    usedExports: true,
    sideEffects: false,
    splitChunks: {
      cacheGroups: {
        waterfall: {
          test: /WaterfallPlugin/,
          name: "waterfall",
          chunks: "all",
        },
      },
    },
  },
};
```

### 验证 Tree-Shaking 效果

同样可通过打包分析工具或比较测试文件大小的方式进行验证。

### 性能监控

可通过示例插件采集滚动与布局时序，或在页面中注入简单统计逻辑。

---

## 🚀 快速开始

### 基础使用

```tsx
import { WaterfallCore } from "@/components/WaterfallPlugin";

<WaterfallCore
  items={items}
  columns={4}
  gap={12}
  padding={12}
  renderItem={(item) => <div style={{ height: item.height }} />}
/>;
```

### 使用插件

```tsx
import {
  withPlugins,
  createAlignmentPlugin,
  createAutoColumnPlugin,
  createResponsiveColumnsPlugin,
  createTransitionPlugin,
} from "@/components/WaterfallPlugin";

const Waterfall = withPlugins(WaterfallCore, [
  createAutoColumnPlugin({ minColumnWidth: 220 }),
  createResponsiveColumnsPlugin({
    breakpoints: {
      xs: { width: 0, columns: 1 },
      sm: { width: 640, columns: 2 },
      md: { width: 768, columns: 3 },
      lg: { width: 1024, columns: 4 },
      xl: { width: 1280, columns: 5 },
    },
  }),
  createAlignmentPlugin({ mode: "shortest" }),
  createTransitionPlugin({ duration: 180, easing: "ease-out" }),
]);
```

### 组合示例：性能优化

```tsx
const WaterfallPerf = withPlugins(WaterfallCore, [
  createTransitionPlugin({ duration: 150 }),
]);
```

---

## 📚 插件列表

本项目提供多个开箱即用的插件，按功能分类如下：

### 🎨 布局与效果

`Alignment`、`AutoColumn`、`ResponsiveColumns`、`FixedHeight`、`Gap`、`Transition`

### ⚡ 性能与渲染

`DebounceLayout`、`Recycle`、`VirtualWaterfall`、`WorkerLayout`、`Throttle`

### 🛡️ 稳健性与交互

`Bookmark`、`DragReorder`、`Grouping`、`ScrollAnchor`、`StickyHeader`

### 🔧 其他

`StatePersistence`、`PinItem`、`HeatmapAnalytics`、`A11y`

> 💡 提示：所有插件位于 `src/components/WaterfallPlugin/custom-plugins/` 目录，可直接查看实现与示例。

---

## 📂 项目结构

```
vane-waterfall/
├── src/
│   ├── components/
│   │   └── WaterfallPlugin/
│   │       ├── core/
│   │       │   └── WaterfallCore.tsx
│   │       ├── plugins/
│   │       │   ├── types.ts
│   │       │   ├── PluginBus.ts
│   │       │   ├── PluginManager.ts
│   │       │   └── withPlugins.tsx
│   │       ├── custom-plugins/
│   │       │   ├── Alignment/
│   │       │   ├── AutoColumn/
│   │       │   ├── InfiniteScroll/
│   │       │   └── ...
│   │       └── README.md
│   └── pages/
│       └── WaterfallPlugin/
│           └── LazyImageIntegrationDemo.tsx
└── README.md
```

---

## 🎯 API 文档

### 核心组件：`WaterfallCore`

#### Props（节选）

| 属性            | 类型                | 说明                              |
| --------------- | ------------------- | --------------------------------- |
| `items`         | `any[]`             | 数据集合（含高度或可测量高度）    |
| `renderItem`    | `(item,i)=>ReactNode` | 渲染函数                         |
| `columns`       | `number`            | 列数（可被插件覆盖）              |
| `gap`           | `number`            | 列间距                            |
| `padding`       | `number`            | 容器内边距（参与布局计算）        |
| `alignmentMode` | `"shortest" | ...` | 列分配策略                        |
| `onReachBottom` | `()=>void`          | 触底回调                          |

### 插件钩子（节选）

- `beforeLayout`、`afterLayout`
- `calculateItemPosition(item, index)`：返回值可覆盖默认位置

---

## 🛠️ 开发建议

- 优先使用 `padding` 控制容器留白，避免仅用 `containerStyle.padding`
- 通过插件扩展行为，保持核心组件简洁稳定
- 大型场景建议结合虚拟化与工作线程布局

---

## 📜 版权许可

本项目以 MIT 许可发布。