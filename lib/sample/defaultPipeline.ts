import type { CipherFlowNode } from "@/types";
import { buildLinearEdges } from "@/lib/utils/pipelineOrder";

/** Preset demo pipeline: 4 configurable steps (meets minimum) + polished defaults. */
export function createDefaultPipeline(): {
  nodes: CipherFlowNode[];
  edges: ReturnType<typeof buildLinearEdges>;
} {
  const nodes: CipherFlowNode[] = [
    {
      id: "n-caesar",
      type: "cipher",
      position: { x: 120, y: 40 },
      data: {
        cipherId: "caesar",
        label: "Caesar",
        order: 0,
        config: { shift: 7 },
      },
    },
    {
      id: "n-xor",
      type: "cipher",
      position: { x: 120, y: 170 },
      data: {
        cipherId: "xor",
        label: "XOR",
        order: 1,
        config: { key: "Vy" },
      },
    },
    {
      id: "n-vig",
      type: "cipher",
      position: { x: 120, y: 300 },
      data: {
        cipherId: "vigenere",
        label: "Vigenère",
        order: 2,
        config: { keyword: "STACK" },
      },
    },
    {
      id: "n-rail",
      type: "cipher",
      position: { x: 120, y: 430 },
      data: {
        cipherId: "railfence",
        label: "Rail Fence",
        order: 3,
        config: { rails: 3 },
      },
    },
  ];

  const ids = nodes.map((n) => n.id);
  return { nodes, edges: buildLinearEdges(ids) };
}

export const SAMPLE_PLAINTEXT =
  "CipherStack builds trustworthy, composable encryption pipelines.";
