import { NavLink } from "react-router-dom";
import React from "react";

export default function Home() {
  return (
    <div className="page">
      <div className="page-header">
        <h1
          className="page-title"
          style={{ fontSize: "2.5em", marginBottom: "16px" }}
        >
          💧 Vane WaterfallPlugin
        </h1>
        <p
          className="page-desc"
          style={{ fontSize: "1.2em", lineHeight: "1.8" }}
        >
          一个功能强大、高度可扩展的 React 瀑布流布局插件式组件库，支持与 LazyLoadImage 集成
        </p>
      </div>

      <div className="page-card" style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "1.5em", marginBottom: "16px" }}>✨ 核心特性</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          <div
            style={{
              padding: "20px",
              background: "#f8f9fa",
              borderRadius: "8px",
              border: "1px solid #e9ecef",
            }}
          >
            <h3 style={{ marginBottom: "8px", fontSize: "1.1em" }}>
              🔌 插件化架构
            </h3>
            <p style={{ color: "#666", lineHeight: "1.6" }}>
              基于插件系统，支持灵活组合与自定义扩展；提供
              calculateItemPosition 等钩子覆盖布局；与 LazyLoadImage 保持一致的架构设计
            </p>
          </div>

          <div
            style={{
              padding: "20px",
              background: "#f8f9fa",
              borderRadius: "8px",
              border: "1px solid #e9ecef",
            }}
          >
            <h3 style={{ marginBottom: "8px", fontSize: "1.1em" }}>
              📐 智能布局
            </h3>
            <p style={{ color: "#666", lineHeight: "1.6" }}>
              使用瀑布流算法自动计算最优布局，支持响应式列数、自定义间距
            </p>
          </div>

          <div
            style={{
              padding: "20px",
              background: "#f8f9fa",
              borderRadius: "8px",
              border: "1px solid #e9ecef",
            }}
          >
            <h3 style={{ marginBottom: "8px", fontSize: "1.1em" }}>
              ⚡ 高性能
            </h3>
            <p style={{ color: "#666", lineHeight: "1.6" }}>
              支持虚拟滚动、Transform 定位、节流防抖等优化手段
            </p>
          </div>

          <div
            style={{
              padding: "20px",
              background: "#f8f9fa",
              borderRadius: "8px",
              border: "1px solid #e9ecef",
            }}
          >
            <h3 style={{ marginBottom: "8px", fontSize: "1.1em" }}>
              🎨 丰富的扩展
            </h3>
            <p style={{ color: "#666", lineHeight: "1.6" }}>
              通过插件支持无限滚动、动画效果、拖拽排序等功能
            </p>
          </div>

          <div
            style={{
              padding: "20px",
              background: "#f8f9fa",
              borderRadius: "8px",
              border: "1px solid #e9ecef",
            }}
          >
            <h3 style={{ marginBottom: "8px", fontSize: "1.1em" }}>
              📱 响应式设计
            </h3>
            <p style={{ color: "#666", lineHeight: "1.6" }}>
              自适应不同设备和屏幕尺寸，支持自定义断点
            </p>
          </div>

          <div
            style={{
              padding: "20px",
              background: "#f8f9fa",
              borderRadius: "8px",
              border: "1px solid #e9ecef",
            }}
          >
            <h3 style={{ marginBottom: "8px", fontSize: "1.1em" }}>
              🔧 TypeScript
            </h3>
            <p style={{ color: "#666", lineHeight: "1.6" }}>
              完整的类型定义，提供优秀的开发体验
            </p>
          </div>
        </div>
      </div>

      <div className="page-card" style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "1.5em", marginBottom: "16px" }}>🚀 快速开始</h2>
        <div style={{ marginBottom: "16px" }}>
          <h3 style={{ fontSize: "1.2em", marginBottom: "12px" }}>
            基础使用示例
          </h3>
          <pre
            style={{
              background: "#2d2d2d",
              color: "#f8f8f2",
              padding: "16px",
              borderRadius: "8px",
              overflow: "auto",
              fontSize: "14px",
              lineHeight: "1.5",
            }}
          >
            {`import { WaterfallCore } from '@/components/WaterfallPlugin';

function MyWaterfall() {
  const items = [
    { id: 1, title: 'Item 1', height: 200 },
    { id: 2, title: 'Item 2', height: 300 },
    // ...
  ];

  return (
    <WaterfallCore
      items={items}
      columns={3}
      gap={16}
      padding={12}
      renderItem={(item) => (
        <div style={{ height: item.height }}>
          <h3>{item.title}</h3>
        </div>
      )}
      keyExtractor={(item) => item.id}
      containerStyle={{ height: '100vh' }}
    />
  );
}`}
          </pre>
        </div>

        <div>
          <h3 style={{ fontSize: "1.2em", marginBottom: "12px" }}>
            使用插件增强功能
          </h3>
          <pre
            style={{
              background: "#2d2d2d",
              color: "#f8f8f2",
              padding: "16px",
              borderRadius: "8px",
              overflow: "auto",
              fontSize: "14px",
              lineHeight: "1.5",
            }}
          >
            {`import {
  WaterfallCore,
  withPlugins,
  createAutoColumnPlugin,
  createResponsiveColumnsPlugin,
  createAlignmentPlugin,
  createTransitionPlugin,
} from '@/components/WaterfallPlugin';

// 通过内置插件组合增强能力
const WaterfallWithPlugins = withPlugins(WaterfallCore, [
  createAutoColumnPlugin({ minColumnWidth: 220, minColumns: 1, maxColumns: 6 }),
  createResponsiveColumnsPlugin({
    breakpoints: {
      xs: { width: 0, columns: 1 },
      sm: { width: 640, columns: 2 },
      md: { width: 768, columns: 3 },
      lg: { width: 1024, columns: 4 },
      xl: { width: 1280, columns: 5 },
    },
  }),
  createAlignmentPlugin({ mode: 'shortest' }),
  createTransitionPlugin({ duration: 180, easing: 'ease-out' }),
]);

function MyEnhancedWaterfall() {
  return (
    <WaterfallWithPlugins
      items={items}
      gap={12}
      padding={12}
      renderItem={(item) => <div style={{ height: item.height }}>{item.title}</div>}
    />
  );
}`}
          </pre>
        </div>
      </div>

      <div className="page-card" style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "1.5em", marginBottom: "16px" }}>
          📚 核心组件示例
        </h2>

        <h3 style={{ fontSize: "1.2em", marginBottom: "12px", color: "#666" }}>
          基础功能
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          <NavLink
            to="/waterfall/basic"
            style={{
              padding: "12px 16px",
              background: "#007bff",
              color: "white",
              borderRadius: "6px",
              textDecoration: "none",
              textAlign: "center",
              transition: "background 0.2s",
            }}
          >
            基础示例
          </NavLink>
          <NavLink
            to="/waterfall/columns"
            style={{
              padding: "12px 16px",
              background: "#007bff",
              color: "white",
              borderRadius: "6px",
              textDecoration: "none",
              textAlign: "center",
              transition: "background 0.2s",
            }}
          >
            自定义列数
          </NavLink>
          <NavLink
            to="/waterfall/custom-gap"
            style={{
              padding: "12px 16px",
              background: "#007bff",
              color: "white",
              borderRadius: "6px",
              textDecoration: "none",
              textAlign: "center",
              transition: "background 0.2s",
            }}
          >
            自定义间距
          </NavLink>
          <NavLink
            to="/waterfall/virtual-scroll"
            style={{
              padding: "12px 16px",
              background: "#007bff",
              color: "white",
              borderRadius: "6px",
              textDecoration: "none",
              textAlign: "center",
              transition: "background 0.2s",
            }}
          >
            虚拟滚动插件
          </NavLink>
        </div>

        <h3 style={{ fontSize: "1.2em", marginBottom: "12px", color: "#666" }}>
          高级功能
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
          }}
        >
          <NavLink
            to="/waterfall/ref-methods"
            style={{
              padding: "12px 16px",
              background: "#28a745",
              color: "white",
              borderRadius: "6px",
              textDecoration: "none",
              textAlign: "center",
              transition: "background 0.2s",
            }}
          >
            Ref 方法调用
          </NavLink>
          <NavLink
            to="/waterfall/lifecycle"
            style={{
              padding: "12px 16px",
              background: "#28a745",
              color: "white",
              borderRadius: "6px",
              textDecoration: "none",
              textAlign: "center",
              transition: "background 0.2s",
            }}
          >
            生命周期和事件
          </NavLink>
          <NavLink
            to="/waterfall/advanced-config"
            style={{
              padding: "12px 16px",
              background: "#28a745",
              color: "white",
              borderRadius: "6px",
              textDecoration: "none",
              textAlign: "center",
              transition: "background 0.2s",
            }}
          >
            高级配置
          </NavLink>
          <NavLink
            to="/waterfall/lazy-image-integration"
            style={{
              padding: "12px 16px",
              background: "#28a745",
              color: "white",
              borderRadius: "6px",
              textDecoration: "none",
              textAlign: "center",
              transition: "background 0.2s",
            }}
          >
            LazyImage 集成演示
          </NavLink>
        </div>
      </div>

      <div className="page-card">
        <h2 style={{ fontSize: "1.5em", marginBottom: "16px" }}>📖 完整文档</h2>
        <p style={{ color: "#666", lineHeight: "1.8", marginBottom: "12px" }}>
          查看完整的 API 文档和插件开发指南，了解更多高级用法。
        </p>
        <NavLink
          to="/readme"
          style={{
            display: "inline-block",
            padding: "10px 20px",
            background: "#28a745",
            color: "white",
            borderRadius: "6px",
            textDecoration: "none",
            transition: "background 0.2s",
          }}
        >
          查看 README 文档
        </NavLink>
      </div>
    </div>
  );
}
