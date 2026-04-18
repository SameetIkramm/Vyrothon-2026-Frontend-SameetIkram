import type { Edge } from "@xyflow/react";

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
