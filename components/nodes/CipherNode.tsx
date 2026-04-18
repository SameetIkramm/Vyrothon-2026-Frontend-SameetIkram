"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { memo } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { configSummary } from "@/lib/utils/configSummary";
import { useCipherStore } from "@/store/useCipherStore";
import type { CipherFlowNode } from "@/types";
import { cn } from "@/lib/utils/cn";

function CipherNodeInner({ id, data, selected }: NodeProps<CipherFlowNode>) {
  const select = useCipherStore((s) => s.setSelectedNodeId);
  const remove = useCipherStore((s) => s.removeNode);
  const move = useCipherStore((s) => s.moveNode);
  const nodes = useCipherStore((s) => s.nodes);

  const sorted = [...nodes].sort((a, b) => a.data.order - b.data.order);
  const idx = sorted.findIndex((n) => n.id === id);
  const canUp = idx > 0;
  const canDown = idx >= 0 && idx < sorted.length - 1;

  return (
    <div
      className={cn(
        "min-w-[220px] max-w-[260px] rounded-xl border bg-card/95 p-3 shadow-lg backdrop-blur-sm transition-shadow",
        selected
          ? "border-primary ring-2 ring-primary/40 shadow-primary/10"
          : "border-border/90 hover:border-border",
      )}
      onClick={() => select(id)}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2.5 !w-2.5 !border-2 !border-primary/60 !bg-background"
      />
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Step {data.order + 1}
          </p>
          <p className="text-sm font-semibold leading-tight">{data.label}</p>
        </div>
        <Badge variant="muted" className="shrink-0 font-mono text-[10px]">
          {configSummary(data.cipherId, data.config)}
        </Badge>
      </div>
      <div className="mt-3 flex items-center justify-between gap-1 border-t border-border/60 pt-2">
        <div className="flex gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={!canUp}
            onClick={(e) => {
              e.stopPropagation();
              move(id, -1);
            }}
            aria-label="Move up"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={!canDown}
            onClick={(e) => {
              e.stopPropagation();
              move(id, 1);
            }}
            aria-label="Move down"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            remove(id);
          }}
          aria-label="Remove node"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2.5 !w-2.5 !border-2 !border-primary/60 !bg-background"
      />
    </div>
  );
}

export const CipherNode = memo(CipherNodeInner);
