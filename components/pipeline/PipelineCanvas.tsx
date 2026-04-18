"use client";

import {
  Background,
  BackgroundVariant,
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
import { computeTranslateExtent } from "@/lib/utils/pipelineOrder";
import { useCipherStore } from "@/store/useCipherStore";
import type { CipherFlowNode } from "@/types";

const nodeTypes: NodeTypes = {
  cipher: CipherNode,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  type: "smoothstep",
  style: {
    stroke: "hsl(188 78% 52%)",
    strokeWidth: 2.25,
    filter: "drop-shadow(0 0 6px hsl(188 78% 42% / 0.35))",
  },
  animated: true,
};

function FitViewOnNodes({ count }: { count: number }) {
  const { fitView } = useReactFlow();
  useEffect(() => {
    if (count === 0) return;
    const t = requestAnimationFrame(() => {
      fitView({
        padding: 0.2,
        duration: 400,
        minZoom: 0.55,
        maxZoom: 1.15,
      });
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

  const translateExtent = useMemo(
    () => computeTranslateExtent(nodes),
    [nodes],
  );

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-xl border border-border/50 bg-gradient-to-b from-secondary/35 via-background to-background shadow-[0_0_0_1px_hsl(188_78%_50%_/_0.06),0_16px_48px_-20px_rgba(0,0,0,0.45)] ring-1 ring-inset ring-white/[0.05]">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border/40 bg-card/20 px-3 py-2 backdrop-blur-sm">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Cipher chain
        </p>
        <p className="text-[11px] tabular-nums text-muted-foreground/90">
          {nodes.length === 0
            ? "No steps"
            : `${nodes.length} step${nodes.length === 1 ? "" : "s"}`}
        </p>
      </div>

      <div className="relative min-h-0 flex-1">
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
          translateExtent={translateExtent}
          minZoom={0.55}
          maxZoom={1.15}
          className="bg-transparent!"
        >
          <FitViewOnNodes count={nodes.length} />
          <Background
            id="cipher-flow-bg"
            variant={BackgroundVariant.Dots}
            gap={22}
            size={1.15}
            color="hsl(217 33% 26%)"
          />
          <Controls
            className="m-2! rounded-lg! border-border! bg-card/92! shadow-md! backdrop-blur-sm sm:m-3!"
            showInteractive={false}
          />
          <MiniMap
            className="hidden rounded-lg! border! border-border/70! bg-card/90! shadow-lg backdrop-blur-sm sm:block"
            nodeStrokeWidth={1.5}
            nodeColor="hsl(188 78% 44%)"
            nodeStrokeColor="hsl(188 78% 28%)"
            bgColor="hsl(222 40% 7%)"
            maskColor="hsl(222 47% 5% / 0.72)"
            maskStrokeColor="hsl(188 78% 48% / 0.35)"
            maskStrokeWidth={1}
          />
        </ReactFlow>
        {nodes.length === 0 && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6 text-center">
            <div className="max-w-sm rounded-xl border border-dashed border-primary/25 bg-card/50 px-5 py-6 text-sm text-muted-foreground shadow-inner backdrop-blur-sm">
              <p className="font-medium text-foreground">No pipeline yet</p>
              <p className="mt-2 leading-relaxed">
                Add ciphers from the library to build a sequential stack. You need
                at least three configurable nodes before running.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
