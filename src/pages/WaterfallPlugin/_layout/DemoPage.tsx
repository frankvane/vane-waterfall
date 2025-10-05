import React, { useEffect, useState } from "react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useLocation } from "react-router-dom";

type DemoPageProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

// 路由路径到文件名的映射
const routeToFileMap: Record<string, string> = {
  "/waterfall/basic": "BasicDemo",
  "/waterfall/columns": "ColumnsDemo",
  "/waterfall/custom-gap": "CustomGapDemo",
  "/waterfall/ref-methods": "RefMethodsDemo",
  "/waterfall/lifecycle": "LifecycleDemo",
  "/waterfall/advanced-config": "AdvancedConfigDemo",
  "/waterfall/auto-columns": "AutoColumnDemo",
  "/waterfall/alignment-plugin": "AlignmentDemo",
  "/waterfall/fixed-height-plugin": "FixedHeightDemo",
  "/waterfall/gap-plugin": "GapPluginDemo",
  "/waterfall/responsive-columns": "ResponsiveColumnsDemo",
  "/waterfall/virtual-images": "VirtualImageDemo",
  "/waterfall/virtual-dynamic": "VirtualDynamicDemo",
  "/waterfall/throttle-plugin": "ThrottlePluginDemo",
  "/waterfall/debounce-layout-plugin": "DebounceLayoutPluginDemo",
  "/waterfall/recycle-plugin": "RecyclePluginDemo",
};

// 通过显式的动态导入映射，确保 Vite 能正确打包这些原文件的 raw 文本
const fileLoaderMap: Record<string, () => Promise<{ default: string }>> = {
  BasicDemo: () => import("../BasicDemo.tsx?raw"),
  ColumnsDemo: () => import("../ColumnsDemo.tsx?raw"),
  CustomGapDemo: () => import("../CustomGapDemo.tsx?raw"),
  RefMethodsDemo: () => import("../RefMethodsDemo.tsx?raw"),
  LifecycleDemo: () => import("../LifecycleDemo.tsx?raw"),
  AdvancedConfigDemo: () => import("../AdvancedConfigDemo.tsx?raw"),
  AutoColumnDemo: () => import("../AutoColumnDemo.tsx?raw"),
  AlignmentDemo: () => import("../AlignmentDemo.tsx?raw"),
  FixedHeightDemo: () => import("../FixedHeightDemo.tsx?raw"),
  GapPluginDemo: () => import("../GapPluginDemo.tsx?raw"),
  ResponsiveColumnsDemo: () => import("../ResponsiveColumnsDemo.tsx?raw"),
  VirtualImageDemo: () => import("../VirtualImageDemo.tsx?raw"),
  VirtualDynamicDemo: () => import("../VirtualDynamicDemo.tsx?raw"),
  ThrottlePluginDemo: () => import("../ThrottlePluginDemo.tsx?raw"),
  DebounceLayoutPluginDemo: () => import("../DebounceLayoutPluginDemo.tsx?raw"),
  RecyclePluginDemo: () => import("../RecyclePluginDemo.tsx?raw"),
};

const DemoPage: React.FC<DemoPageProps> = ({
  title,
  description,
  children,
}) => {
  const location = useLocation();
  const [sourceCode, setSourceCode] = useState<string>("");

  useEffect(() => {
    const loadSourceCode = async () => {
      // 获取当前路由对应的文件名
      const fileName = routeToFileMap[location.pathname];
      if (fileName) {
        try {
          // 使用显式映射，避免变量路径的动态导入在构建阶段无法被静态分析
          const loader = fileLoaderMap[fileName];
          if (loader) {
            const module = await loader();
            setSourceCode(module.default);
          } else {
            setSourceCode("// 源码映射未找到");
          }
        } catch (error) {
          console.error("加载源码失败:", error);
          setSourceCode("// 源码加载失败");
        }
      }
    };

    loadSourceCode();
  }, [location.pathname]);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">{title}</h1>
        {description ? <p className="page-desc">{description}</p> : null}
      </div>
      <div className="page-card">{children}</div>

      {sourceCode && (
        <div className="page-card" style={{ marginTop: "20px" }}>
          <h2 style={{ marginBottom: "10px", fontSize: "1.2em" }}>源码</h2>
          <SyntaxHighlighter
            language="tsx"
            style={tomorrow}
            showLineNumbers={true}
            wrapLines={true}
            wrapLongLines={true}
            customStyle={{
              borderRadius: "4px",
              fontSize: "14px",
              lineHeight: "1.5",
              margin: 0,
            }}
          >
            {sourceCode}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  );
};

export default DemoPage;
