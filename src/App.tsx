import "./App.css";

import { NavLink, Navigate, Route, Routes } from "react-router-dom";

import AdvancedConfigDemo from "./pages/WaterfallPlugin/AdvancedConfigDemo";
import BasicDemo from "./pages/WaterfallPlugin/BasicDemo";
import ColumnsDemo from "./pages/WaterfallPlugin/ColumnsDemo";
import CustomGapDemo from "./pages/WaterfallPlugin/CustomGapDemo";
import LifecycleDemo from "./pages/WaterfallPlugin/LifecycleDemo";
import React from "react";
import RefMethodsDemo from "./pages/WaterfallPlugin/RefMethodsDemo";
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
        </nav>
      </aside>
      <main className="main">
        <Routes>
          <Route path="/" element={<WaterfallHome />} />
          <Route path="/readme" element={<WaterfallReadme />} />
          <Route path="/waterfall/basic" element={<BasicDemo />} />
          <Route path="/waterfall/columns" element={<ColumnsDemo />} />
          <Route path="/waterfall/custom-gap" element={<CustomGapDemo />} />
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
