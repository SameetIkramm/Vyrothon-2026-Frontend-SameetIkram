import type { Edge } from "@xyflow/react";
import type { CipherFlowNode, PipelineExport, PipelineMode } from "@/types";
import { buildLinearEdges } from "@/lib/utils/pipelineOrder";

export function exportPipelineJson(opts: {
  name: string;
  mode: PipelineMode;
  nodes: CipherFlowNode[];
  edges: Edge[];
  plaintext?: string;
}): string {
  const payload: PipelineExport = {
    version: 1,
    name: opts.name,
    mode: opts.mode,
    nodes: opts.nodes.map((n) => ({
      id: n.id,
      type: "cipher",
      position: { ...n.position },
      data: {
        ...n.data,
        config: { ...n.data.config },
      },
    })),
    edges: opts.edges.map((e) => ({ ...e })),
    plaintext: opts.plaintext,
  };
  return JSON.stringify(payload, null, 2);
}

export function importPipelineJson(raw: string):
  | { ok: true; data: PipelineExport }
  | { ok: false; error: string } {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") {
      return { ok: false, error: "JSON must be an object." };
    }
    const p = parsed as Record<string, unknown>;
    if (p.version !== 1) {
      return { ok: false, error: "Unsupported version (expected 1)." };
    }
    if (typeof p.name !== "string") {
      return { ok: false, error: "Missing pipeline name." };
    }
    if (p.mode !== "encrypt" && p.mode !== "decrypt") {
      return { ok: false, error: "Invalid mode." };
    }
    if (!Array.isArray(p.nodes) || !Array.isArray(p.edges)) {
      return { ok: false, error: "Nodes and edges must be arrays." };
    }
    return { ok: true, data: p as unknown as PipelineExport };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Invalid JSON";
    return { ok: false, error: msg };
  }
}

export function toFlowState(data: PipelineExport): {
  nodes: CipherFlowNode[];
  edges: Edge[];
} {
  const nodes = data.nodes as CipherFlowNode[];
  const sorted = [...nodes].sort((a, b) => a.data.order - b.data.order);
  const ids = sorted.map((n) => n.id);
  return {
    nodes: sorted,
    edges: data.edges.length ? (data.edges as Edge[]) : buildLinearEdges(ids),
  };
}
