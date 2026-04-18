"use client";

import { applyNodeChanges, type Edge, type NodeChange } from "@xyflow/react";
import { create } from "zustand";

import { getCipherOrThrow } from "@/lib/ciphers";
import { executePipeline } from "@/lib/engine/executePipeline";
import { createDefaultPipeline, SAMPLE_PLAINTEXT } from "@/lib/sample/defaultPipeline";
import {
  exportPipelineJson,
  importPipelineJson,
  toFlowState,
} from "@/lib/utils/importExport";
import { buildLinearEdges, layoutStackPosition } from "@/lib/utils/pipelineOrder";
import {
  hasBlockingErrors,
  validatePipelineForRun,
} from "@/lib/validation/pipeline";
import type {
  CipherConfig,
  CipherFlowNode,
  ExecutionStep,
  PipelineMode,
  RunStatus,
  ValidationErrorsState,
} from "@/types";

function newId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id-${Math.random().toString(36).slice(2)}`;
}

function normalizeOrders(nodes: CipherFlowNode[]): CipherFlowNode[] {
  const sorted = [...nodes].sort((a, b) => a.data.order - b.data.order);
  return sorted.map((n, i) => ({
    ...n,
    position: layoutStackPosition(i),
    data: { ...n.data, order: i },
  }));
}

function rebuildEdges(nodes: CipherFlowNode[]): Edge[] {
  const sorted = [...nodes].sort((a, b) => a.data.order - b.data.order);
  return buildLinearEdges(sorted.map((n) => n.id));
}

const emptyErrors: ValidationErrorsState = { pipeline: [], nodes: {} };

interface CipherStoreState {
  nodes: CipherFlowNode[];
  edges: Edge[];
  selectedNodeId: string | null;
  mode: PipelineMode;
  plaintext: string;
  finalOutput: string;
  executionTrace: ExecutionStep[];
  runStatus: RunStatus;
  validationErrors: ValidationErrorsState;
  stepHighlight: number | null;
}

interface CipherStoreActions {
  hydrateDefault: () => void;
  setSelectedNodeId: (id: string | null) => void;
  setMode: (mode: PipelineMode) => void;
  setPlaintext: (text: string) => void;
  onNodesChange: (changes: NodeChange<CipherFlowNode>[]) => void;
  addCipherNode: (cipherId: string) => void;
  removeNode: (nodeId: string) => void;
  moveNode: (nodeId: string, direction: -1 | 1) => void;
  updateNodeConfig: (nodeId: string, patch: Partial<CipherConfig>) => void;
  runPipeline: () => void;
  clearOutput: () => void;
  resetSample: () => void;
  exportPipeline: () => string;
  importPipeline: (raw: string) => { ok: boolean; message: string };
  setStepHighlight: (index: number | null) => void;
  animateTrace: () => void;
}

export type CipherStore = CipherStoreState & CipherStoreActions;

export const useCipherStore = create<CipherStore>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  mode: "encrypt",
  plaintext: SAMPLE_PLAINTEXT,
  finalOutput: "",
  executionTrace: [],
  runStatus: "idle",
  validationErrors: emptyErrors,
  stepHighlight: null,

  hydrateDefault: () => {
    const { nodes, edges } = createDefaultPipeline();
    set({
      nodes,
      edges,
      selectedNodeId: nodes[0]?.id ?? null,
      plaintext: SAMPLE_PLAINTEXT,
      finalOutput: "",
      executionTrace: [],
      runStatus: "idle",
      validationErrors: validatePipelineForRun(nodes),
      stepHighlight: null,
    });
  },

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),

  setMode: (mode) => set({ mode }),

  setPlaintext: (text) => set({ plaintext: text }),

  onNodesChange: (changes) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes) as CipherFlowNode[],
    }));
  },

  addCipherNode: (cipherId) => {
    const def = getCipherOrThrow(cipherId);
    const v = def.validateConfig(def.defaultConfig);
    if (!v.valid) return;
    set((state) => {
      const maxOrder = state.nodes.reduce(
        (m, n) => Math.max(m, n.data.order),
        -1,
      );
      const order = maxOrder + 1;
      const id = newId();
      const node: CipherFlowNode = {
        id,
        type: "cipher",
        position: layoutStackPosition(order),
        data: {
          cipherId: def.id,
          label: def.name,
          order,
          config: { ...v.config } as CipherConfig,
        },
      };
      const nodes = normalizeOrders([...state.nodes, node]);
      const edges = rebuildEdges(nodes);
      return {
        nodes,
        edges,
        selectedNodeId: id,
        validationErrors: validatePipelineForRun(nodes),
      };
    });
  },

  removeNode: (nodeId) => {
    set((state) => {
      const filtered = state.nodes.filter((n) => n.id !== nodeId);
      const nodes = normalizeOrders(filtered);
      const edges = rebuildEdges(nodes);
      const selected =
        state.selectedNodeId === nodeId
          ? nodes[0]?.id ?? null
          : state.selectedNodeId;
      return {
        nodes,
        edges,
        selectedNodeId: selected,
        validationErrors: validatePipelineForRun(nodes),
      };
    });
  },

  moveNode: (nodeId, direction) => {
    set((state) => {
      const sorted = [...state.nodes].sort((a, b) => a.data.order - b.data.order);
      const idx = sorted.findIndex((n) => n.id === nodeId);
      if (idx < 0) return {};
      const swapWith = idx + direction;
      if (swapWith < 0 || swapWith >= sorted.length) return {};
      const a = sorted[idx];
      const b = sorted[swapWith];
      const next = state.nodes.map((n) => {
        if (n.id === a.id) return { ...n, data: { ...n.data, order: b.data.order } };
        if (n.id === b.id) return { ...n, data: { ...n.data, order: a.data.order } };
        return n;
      });
      const nodes = normalizeOrders(next as CipherFlowNode[]);
      const edges = rebuildEdges(nodes);
      return {
        nodes,
        edges,
        validationErrors: validatePipelineForRun(nodes),
      };
    });
  },

  updateNodeConfig: (nodeId, patch) => {
    set((state) => {
      const node = state.nodes.find((n) => n.id === nodeId);
      if (!node) return {};
      const merged = { ...node.data.config, ...patch };
      const nodes = state.nodes.map((n) =>
        n.id === nodeId
          ? {
              ...n,
              data: {
                ...n.data,
                config: merged as CipherConfig,
              },
            }
          : n,
      ) as CipherFlowNode[];
      return {
        nodes,
        validationErrors: validatePipelineForRun(nodes),
      };
    });
  },

  runPipeline: () => {
    const state = get();
    const errors = validatePipelineForRun(state.nodes);
    set({ validationErrors: errors });
    if (hasBlockingErrors(errors)) {
      set({ runStatus: "error", executionTrace: [], finalOutput: "" });
      return;
    }
    set({ runStatus: "running", stepHighlight: null });
    const input = state.plaintext;
    const { trace, output, ok } = executePipeline(
      state.nodes,
      state.mode,
      input,
    );
    set({
      executionTrace: trace,
      finalOutput: ok ? output : "",
      runStatus: ok ? "success" : "error",
      stepHighlight: null,
    });
  },

  clearOutput: () =>
    set({
      finalOutput: "",
      executionTrace: [],
      runStatus: "idle",
      stepHighlight: null,
    }),

  resetSample: () => {
    const { nodes, edges } = createDefaultPipeline();
    set({
      nodes,
      edges,
      plaintext: SAMPLE_PLAINTEXT,
      finalOutput: "",
      executionTrace: [],
      runStatus: "idle",
      selectedNodeId: nodes[0]?.id ?? null,
      validationErrors: validatePipelineForRun(nodes),
      stepHighlight: null,
    });
  },

  exportPipeline: () =>
    exportPipelineJson({
      name: "CipherStack Pipeline",
      mode: get().mode,
      nodes: get().nodes,
      edges: get().edges,
      plaintext: get().plaintext,
    }),

  importPipeline: (raw) => {
    const res = importPipelineJson(raw);
    if (!res.ok) return { ok: false, message: res.error };
    const { nodes, edges } = toFlowState(res.data);
    set({
      nodes,
      edges,
      mode: res.data.mode,
      plaintext: res.data.plaintext ?? "",
      finalOutput: "",
      executionTrace: [],
      runStatus: "idle",
      selectedNodeId: nodes[0]?.id ?? null,
      validationErrors: validatePipelineForRun(nodes),
      stepHighlight: null,
    });
    return { ok: true, message: "Pipeline imported." };
  },

  setStepHighlight: (index) => set({ stepHighlight: index }),

  animateTrace: () => {
    const trace = get().executionTrace;
    if (!trace.length) return;
    let i = 0;
    set({ stepHighlight: 0 });
    const id = window.setInterval(() => {
      i += 1;
      if (i >= trace.length) {
        window.clearInterval(id);
        set({ stepHighlight: null });
      } else {
        set({ stepHighlight: i });
      }
    }, 520);
  },
}));
