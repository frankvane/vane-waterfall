import "./App.css";

import { NavLink, Navigate, Route, Routes } from "react-router-dom";

import AdvancedConfigDemo from "./pages/WaterfallPlugin/AdvancedConfigDemo";
import AlignmentDemo from "./pages/WaterfallPlugin/AlignmentDemo";
import AutoColumnDemo from "./pages/WaterfallPlugin/AutoColumnDemo";
import BasicDemo from "./pages/WaterfallPlugin/BasicDemo";
import ColumnsDemo from "./pages/WaterfallPlugin/ColumnsDemo";
import CustomGapDemo from "./pages/WaterfallPlugin/CustomGapDemo";
import DebounceLayoutPluginDemo from "./pages/WaterfallPlugin/DebounceLayoutPluginDemo";
import FixedHeightDemo from "./pages/WaterfallPlugin/FixedHeightDemo";
import GapPluginDemo from "./pages/WaterfallPlugin/GapPluginDemo";
import LifecycleDemo from "./pages/WaterfallPlugin/LifecycleDemo";
import React from "react";
import RecyclePluginDemo from "./pages/WaterfallPlugin/RecyclePluginDemo";
import RefMethodsDemo from "./pages/WaterfallPlugin/RefMethodsDemo";
import ResponsiveColumnsDemo from "./pages/WaterfallPlugin/ResponsiveColumnsDemo";
import ThrottlePluginDemo from "./pages/WaterfallPlugin/ThrottlePluginDemo";
import VirtualDynamicDemo from "./pages/WaterfallPlugin/VirtualDynamicDemo";
import VirtualImageDemo from "./pages/WaterfallPlugin/VirtualImageDemo";
import WaterfallHome from "./pages/WaterfallPlugin/Home";
import WaterfallReadme from "./pages/WaterfallPlugin/ReadmeDemo";

// Waterfall 组件导入

const App: React.FC = () => {
  return (
    <div className="app">
      <aside className="sidebar">
        <h2>Vane WaterfallPlugin 演示</h2>
        <nav className="nav">
          <NavLink to="/" end>
            首页
          </NavLink>
          <NavLink to="/readme">📖 README 文档</NavLink>

          <h3 style={{ marginTop: 12 }}>基础功能</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <NavLink to="/waterfall/basic">基础示例</NavLink>
            <NavLink to="/waterfall/columns">自定义列数</NavLink>
            <NavLink to="/waterfall/custom-gap">自定义间距</NavLink>
          </div>

          <h3 style={{ marginTop: 12 }}>高级功能</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <NavLink to="/waterfall/ref-methods">Ref 方法调用</NavLink>
            <NavLink to="/waterfall/lifecycle">生命周期和事件</NavLink>
            <NavLink to="/waterfall/advanced-config">高级配置</NavLink>
          </div>

          <h3 style={{ marginTop: 12 }}>插件功能</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <NavLink to="/waterfall/responsive-columns">响应式列数插件</NavLink>
            <NavLink to="/waterfall/auto-columns">自动列数插件</NavLink>
            <NavLink to="/waterfall/alignment-plugin">对齐策略插件</NavLink>
            <NavLink to="/waterfall/fixed-height-plugin">固定高度插件</NavLink>
            <NavLink to="/waterfall/gap-plugin">间距插件</NavLink>
            <NavLink to="/waterfall/virtual-images">虚拟瀑布流</NavLink>
            <NavLink to="/waterfall/virtual-dynamic">虚拟瀑布流（动态高度）</NavLink>
            <NavLink to="/waterfall/throttle-plugin">Throttle 插件演示</NavLink>
            <NavLink to="/waterfall/debounce-layout-plugin">DebounceLayout 插件演示</NavLink>
            <NavLink to="/waterfall/recycle-plugin">Recycle 插件演示</NavLink>
          </div>
        </nav>
      </aside>
      <main className="main">
        <Routes>
          <Route path="/" element={<WaterfallHome />} />
          <Route path="/readme" element={<WaterfallReadme />} />
          <Route path="/waterfall/basic" element={<BasicDemo />} />
          <Route path="/waterfall/columns" element={<ColumnsDemo />} />
          <Route path="/waterfall/custom-gap" element={<CustomGapDemo />} />
          <Route
            path="/waterfall/responsive-columns"
            element={<ResponsiveColumnsDemo />}
          />
          <Route
            path="/waterfall/auto-columns"
            element={<AutoColumnDemo />}
          />
          <Route
            path="/waterfall/alignment-plugin"
            element={<AlignmentDemo />}
          />
          <Route
            path="/waterfall/fixed-height-plugin"
            element={<FixedHeightDemo />}
          />
          <Route
            path="/waterfall/gap-plugin"
            element={<GapPluginDemo />}
          />
          <Route path="/waterfall/virtual-images" element={<VirtualImageDemo />} />
          <Route path="/waterfall/virtual-dynamic" element={<VirtualDynamicDemo />} />
          <Route path="/waterfall/throttle-plugin" element={<ThrottlePluginDemo />} />
          <Route path="/waterfall/debounce-layout-plugin" element={<DebounceLayoutPluginDemo />} />
          <Route path="/waterfall/recycle-plugin" element={<RecyclePluginDemo />} />
          <Route path="/waterfall/ref-methods" element={<RefMethodsDemo />} />
          <Route path="/waterfall/lifecycle" element={<LifecycleDemo />} />
          <Route
            path="/waterfall/advanced-config"
            element={<AdvancedConfigDemo />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
