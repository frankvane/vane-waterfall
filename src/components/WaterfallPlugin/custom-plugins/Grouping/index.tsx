import type { WaterfallPlugin } from "../../plugins/types";
import type React from "react";

type GroupingConfig<T = any> = {
  /** 分组函数，返回组键 */
  groupBy?: (item: T, index: number) => string | number;
};

/**
 * GroupingPlugin - 按组聚合（实验版）
 * - 计算分组信息，写入 sharedData(GROUPS)
 * - 仅提供覆盖层标签展示当前分组数量
 */
export function createGroupingPlugin<T = any>(config: GroupingConfig<T> = {}): WaterfallPlugin<T> {
  const groupBy = config.groupBy || ((item: any) => (item?.category ?? "default"));
  const KEY = "GROUPS";
  return {
    name: "GroupingPlugin",
    enabled: true,
    hooks: {
      onPropsChange: (context, _prev, next) => {
        const items = next.items || [];
        const groups = new Map<string | number, number[]>();
        items.forEach((it, idx) => {
          const g = groupBy(it, idx);
          if (!groups.has(g)) groups.set(g, []);
          groups.get(g)!.push(idx);
        });
    context.sharedData?.set(KEY, groups);
      },
      renderOverlay: (context) => {
    const groups: Map<string | number, number[]> = context.sharedData?.get(KEY) || new Map();
        if (groups.size === 0) return null;
        const entries = Array.from(groups.entries()).slice(0, 3);
        return (
          <div
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              zIndex:99,
              background: "#111827",
              color: "#fff",
              padding: "10px",
              borderRadius: 8,
              boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
              border: "1px solid rgba(255,255,255,0.15)",
              minWidth: 160,
              fontSize: 12,
            }}
          >
            <div style={{ opacity: 0.85, marginBottom: 6 }}>分组统计：{groups.size} 组</div>
            {entries.map(([key, list]) => (
              <div key={String(key)}>
                {String(key)}：{list.length} 项
              </div>
            ))}
          </div>
        );
      },
    },
  };
}