import type { WaterfallPlugin } from "../../plugins/types";

type A11yConfig = {
  /** 为容器设置 ARIA role（默认 list） */
  containerRole?: string;
  /** 为项设置 ARIA role（默认 listitem） */
  itemRole?: string;
  /** 是否给项添加 tabindex 便于键盘焦点 */
  enableTabIndex?: boolean;
};

/**
 * A11yPlugin - 可访问性增强
 * - 为容器与项添加合理的 ARIA 角色与属性
 * - 为项添加 tabindex，支持键盘导航与聚焦
 */
export function createA11yPlugin<T = any>(config: A11yConfig = {}): WaterfallPlugin<T> {
  const containerRole = config.containerRole ?? "list";
  const itemRole = config.itemRole ?? "listitem";
  const enableTabIndex = config.enableTabIndex ?? true;

  return {
    name: "A11yPlugin",
    enabled: true,
    hooks: {
      renderOverlay: (context) => {
        // 通过在容器上添加 data- 属性，结合 CSS 或测试识别
        const container = context.containerRef.current;
        if (container) {
          container.setAttribute("role", containerRole);
          container.setAttribute("aria-label", "Waterfall list");
        }

        return null;
      },
      renderItemWrapper: (context, content, index) => {
        return (
          <div
            role={itemRole}
            aria-posinset={typeof index === "number" ? index + 1 : undefined}
            aria-setsize={context.itemCount}
            tabIndex={enableTabIndex ? 0 : undefined}
            style={{ outline: "none" }}
          >
            {content}
          </div>
        );
      },
    },
  };
}