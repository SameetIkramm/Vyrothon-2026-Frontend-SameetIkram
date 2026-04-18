"use client";

import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type DefaultEdgeOptions,
  type Node,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useMemo, type MouseEvent } from "react";
import { useReactFlow } from "@xyflow/react";

import { CipherNode } from "@/components/nodes/CipherNode";
import { useCipherStore } from "@/store/useCipherStore";
import type { CipherFlowNode } from "@/types";

const nodeTypes: NodeTypes = {
  cipher: CipherNode,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  type: "smoothstep",
  style: { stroke: "hsl(188 78% 42%)", strokeWidth: 2 },
  animated: true,
};

function FitViewOnNodes({ count }: { count: number }) {
  const { fitView } = useReactFlow();
  useEffect(() => {
    if (count === 0) return;
    const t = requestAnimationFrame(() => {
      fitView({ padding: 0.35, duration: 400 });
    });
    return () => cancelAnimationFrame(t);
  }, [count, fitView]);
  return null;
}

export function PipelineCanvas() {
  const nodes = useCipherStore((s) => s.nodes);
  const edges = useCipherStore((s) => s.edges);
  const onNodesChange = useCipherStore((s) => s.onNodesChange);
  const select = useCipherStore((s) => s.setSelectedNodeId);

  const onNodeClick = useCallback(
    (_: MouseEvent, node: Node) => {
      select(node.id);
    },
    [select],
  );

  const onPaneClick = useCallback(() => {
    select(null);
  }, [select]);

  const rfNodes = useMemo(() => nodes as CipherFlowNode[], [nodes]);

  return (
    <div className="relative h-full min-h-[420px] w-full rounded-xl border border-border/80 bg-gradient-to-b from-secondary/30 to-background overflow-hidden">
      <ReactFlow
        nodes={rfNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        proOptions={{ hideAttribution: true }}
        nodesDraggable
        nodesConnectable={false}
        elementsSelectable
        panOnScroll
        zoomOnScroll
        minZoom={0.4}
        maxZoom={1.4}
        className="!bg-transparent"
      >
        <FitViewOnNodes count={nodes.length} />
        <Background gap={20} size={1} color="hsl(217 33% 22%)" />
        <Controls
          className="!m-3 !rounded-lg !border-border !bg-card/90 !shadow-md"
          showInteractive={false}
        />
        <MiniMap
          className="!rounded-lg !border !border-border/80 !bg-card/80"
          nodeStrokeWidth={2}
          maskColor="hsl(222 47% 6% / 0.65)"
        />
      </ReactFlow>
      {nodes.length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6 text-center">
          <div className="max-w-sm rounded-lg border border-dashed border-border/80 bg-card/40 px-4 py-6 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">No pipeline yet</p>
            <p className="mt-2">
              Add ciphers from the library to build a sequential stack. You need
              at least three configurable nodes before running.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
