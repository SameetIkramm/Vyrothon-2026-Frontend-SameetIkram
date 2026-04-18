import type { CoordinateExtent, Edge } from "@xyflow/react";

/** Approximate node footprint in flow coordinates (matches stacked cipher cards). */
const FLOW_NODE_WIDTH = 260;
const FLOW_NODE_HEIGHT = 160;
const FLOW_VIEW_PADDING = 100;

/** Pan limits in flow space so the viewport cannot drift into empty canvas when the chain is short. */
export function computeTranslateExtent(
  nodes: ReadonlyArray<{ position: { x: number; y: number } }>,
): CoordinateExtent {
  if (nodes.length === 0) {
    return [
      [0, 0],
      [520, 480],
    ];
  }
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const n of nodes) {
    const { x, y } = n.position;
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + FLOW_NODE_WIDTH);
    maxY = Math.max(maxY, y + FLOW_NODE_HEIGHT);
  }
  const pad = FLOW_VIEW_PADDING;
  return [
    [minX - pad, minY - pad],
    [maxX + pad, maxY + pad],
  ];
}

/** Linear edges connecting nodes in `order` sequence. */
export function buildLinearEdges(nodeIds: string[]): Edge[] {
  const edges: Edge[] = [];
  for (let i = 0; i < nodeIds.length - 1; i++) {
    edges.push({
      id: `e-${nodeIds[i]}-${nodeIds[i + 1]}`,
      source: nodeIds[i],
      target: nodeIds[i + 1],
      type: "smoothstep",
      animated: true,
    });
  }
  return edges;
}

export function layoutStackPosition(index: number): { x: number; y: number } {
  return { x: 120, y: 40 + index * 130 };
}
