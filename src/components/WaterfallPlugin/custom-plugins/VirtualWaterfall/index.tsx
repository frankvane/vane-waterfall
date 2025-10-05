import React, { useEffect, useMemo, useRef, useState } from "react";

import type { WaterfallPlugin } from "../../plugins/types";

export type VirtualWaterfallConfig<T = any> = {
  /** 视口上下额外渲染的像素范围（overscan） */
  overscanPx?: number;
  /** 获取项高度（可选；不可预测时走测量） */
  getItemHeight?: (item: T, index: number) => number;
  /** 动态高度测量模式：开启后使用 ResizeObserver 实时测量 */
  dynamicHeights?: boolean;
  /** 初始估算高度（用于首屏布局与未测量项） */
  estimateItemHeight?: number;
};

export function createVirtualWaterfallPlugin<T = any>(
  config: VirtualWaterfallConfig<T>
): WaterfallPlugin<T> {
  // 原始渲染函数用于 overlay 中渲染项
  let originalRenderItem: ((item: T, index: number) => React.ReactNode) | null = null;

  // Overlay 组件：在插件内完成“最矮列分配 + 像素范围虚拟化”（不依赖 react-window）
  function Overlay({
    context,
  }: {
    context: any;
  }) {
    const items: T[] = context.items || [];
    const columns = Math.max(1, context.layout?.columns || 3);
    const gap = Number(context.layout?.gap || 0);
    // 首屏时 layout 可能尚未就绪；使用容器宽度计算列宽，避免所有项堆叠在左上角
    const container: HTMLDivElement | null = context.getContainer?.() || null;
    const rawColumnWidth = Number(context.layout?.columnWidth || 0);
    const columnWidth = rawColumnWidth > 0
      ? rawColumnWidth
      : container
      ? (container.clientWidth - gap * (columns - 1)) / columns
      : 0;

    const overscan = config.overscanPx ?? 300;
    const getH = config.getItemHeight;
    const useDynamic = !!config.dynamicHeights;
    const estimateH = Math.max(0, Number(config.estimateItemHeight ?? 200));
    const heightsMapRef = useRef<Map<number, number>>(new Map());
    const observersRef = useRef<Map<number, ResizeObserver>>(new Map());
    const elementsRef = useRef<Map<number, HTMLDivElement | null>>(new Map());
    const updateScheduledRef = useRef(false);
    const updateTimerRef = useRef<number | null>(null);
    const stabilityCountRef = useRef<Map<number, number>>(new Map());
    const columnIndexRef = useRef<number[]>([]); // 稳定的列分配，避免每次测量重排导致抖动
    const [version, setVersion] = useState(0);

    // 组件卸载时清理观察者，避免残留回调导致循环更新
    useEffect(() => {
      return () => {
        observersRef.current.forEach((ro) => {
          try {
            ro.disconnect();
          } catch {}
        });
        observersRef.current.clear();
        heightsMapRef.current.clear();
        elementsRef.current.clear();
      };
    }, []);

    // 列数据结构：每列的索引、尺寸、累计高度
    const columnData = useMemo(() => {
      const cols = Array.from({ length: columns }, () => ({
        indices: [] as number[],
        sizes: [] as number[],
        ys: [] as number[],
        height: 0,
      }));
      const colHeights = Array.from({ length: columns }, () => 0);
      const colIndex = columnIndexRef.current;
      const needInit = colIndex.length !== items.length;
      for (let i = 0; i < items.length; i++) {
        const measured = heightsMapRef.current.get(i);
        const hCandidate =
          (useDynamic ? measured ?? undefined : undefined) ??
          (getH ? getH(items[i], i) : undefined) ??
          estimateH;
        const h = Math.max(0, Number(hCandidate) || 0);

        let target: number;
        if (needInit || colIndex[i] === undefined) {
          // 首次或新增项：按“当前最矮列”分配，一次确定后保持稳定
          target = 0;
          let minH = colHeights[0];
          for (let c = 1; c < columns; c++) {
            if (colHeights[c] < minH) {
              minH = colHeights[c];
              target = c;
            }
          }
          colIndex[i] = target;
        } else {
          target = colIndex[i];
        }

        const y = colHeights[target];
        cols[target].indices.push(i);
        cols[target].sizes.push(h);
        cols[target].ys.push(y);
        colHeights[target] += h + gap;
      }
      // 更新列总高度（基于稳定分配的累计高度）
      for (let c = 0; c < columns; c++) {
        cols[c].height = colHeights[c];
      }
      return cols;
    }, [items, columns, gap, getH, useDynamic, estimateH, version]);

    const totalHeight = useMemo(() => {
      return columnData.reduce((max, col) => Math.max(max, col.height), 0);
    }, [columnData]);

    const vt = Number(context.viewport?.scrollTop || 0);
    const vb = vt + Number(context.viewport?.clientHeight || 0);

    // 如果列宽不可用，先渲染占位高度，避免首帧所有项堆叠在左上角
    if (columnWidth <= 0) {
      const estRows = Math.ceil(items.length / columns);
      const estTotal = Math.max(0, estRows * (estimateH + gap));
      return (
        <div style={{ position: "relative", inset: 0 }}>
          <div style={{ height: estTotal, pointerEvents: "none" }} />
        </div>
      );
    }

    return (
      <div style={{ position: "relative", inset: 0 }}>
        {/* spacer 提供滚动高度，absolute overlay 不参与父容器高度 */}
        <div style={{ height: totalHeight, pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: columns }).map((_, c) => (
            <div
              key={c}
              style={{
                position: "absolute",
                left: c * (columnWidth + gap),
                top: 0,
                width: columnWidth,
                height: totalHeight,
              }}
            >
              {columnData[c].indices.map((originalIndex, i) => {
                const y = columnData[c].ys[i];
                const h = columnData[c].sizes[i];
                const itemBottom = y + h;
                const isVisible = itemBottom > vt - overscan && y < vb + overscan;
                if (!isVisible) return null;
                const item = items[originalIndex];
                const content = originalRenderItem
                  ? originalRenderItem(item, originalIndex)
                  : (
                      <div
                        style={{
                          height: h,
                          boxSizing: "border-box",
                          background: "#fff",
                          borderBottom: "1px solid #f0f0f0",
                        }}
                      />
                    );
                const attachObserver = (el: HTMLDivElement | null) => {
                  const prevEl = elementsRef.current.get(originalIndex) || null;
                  if (prevEl === el) return; // 同一元素，避免重复断开/连接

                  // 如果之前有不同元素的观察者，断开它
                  const prevRo = observersRef.current.get(originalIndex);
                  if (prevRo && prevEl && prevEl !== el) {
                    try {
                      prevRo.disconnect();
                    } catch {}
                    observersRef.current.delete(originalIndex);
                  }

                  elementsRef.current.set(originalIndex, el);
                  if (!el || !useDynamic) return;

                  const ro = new ResizeObserver(() => {
                    const nextH = el.offsetHeight || 0;
                    const prevH = heightsMapRef.current.get(originalIndex) || 0;
                    // 高度变化阈值，过滤字体换行的亚像素震荡
                    if (nextH > 0 && Math.abs(nextH - prevH) > 0.5) {
                      heightsMapRef.current.set(originalIndex, nextH);
                      // 稳定次数重置
                      stabilityCountRef.current.set(originalIndex, 0);
                      // 批量节流：合并 50ms 内所有变更，统一刷新一次
                      if (updateTimerRef.current) {
                        window.clearTimeout(updateTimerRef.current);
                      }
                      updateTimerRef.current = window.setTimeout(() => {
                        setVersion((v) => v + 1);
                        updateTimerRef.current = null;
                        updateScheduledRef.current = false;
                      }, 50);
                    } else {
                      // 高度未显著变化，累计稳定计数并在达到阈值后停止观察
                      const count = (stabilityCountRef.current.get(originalIndex) || 0) + 1;
                      stabilityCountRef.current.set(originalIndex, count);
                      if (count >= 2) {
                        try {
                          ro.disconnect();
                        } catch {}
                        observersRef.current.delete(originalIndex);
                      }
                    }
                  });
                  try {
                    ro.observe(el);
                    observersRef.current.set(originalIndex, ro);
                  } catch {}
                };
                return (
                  <div
                    key={originalIndex}
                    ref={attachObserver}
                    style={{ position: "absolute", top: y, left: 0, width: "100%", height: useDynamic ? undefined : h }}
                  >
                    {content}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 注意：清理应在 Overlay 组件内部执行，避免无效的 Hook 调用

  return {
    name: "VirtualWaterfallPlugin",
    enabled: true,
    hooks: {
      transformProps: (props: any) => {
        // 保存原始渲染函数，并禁用核心项渲染（由 overlay 完成）
        originalRenderItem = props.renderItem;
        return {
          ...props,
          renderItem: () => null,
        };
      },
      renderOverlay: (context: any) => {
        return <Overlay context={context} />;
      },
    },
  };
}