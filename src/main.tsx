/**
 * 应用入口文件
 * 仅用于启动 Demo 应用，不导出任何内容
 * 库导出请查看 src/index.ts
 */

import App from "./App.tsx";
import { HashRouter } from "react-router-dom";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>
);
