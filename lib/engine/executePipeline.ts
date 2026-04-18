import { getCipherOrThrow } from "@/lib/ciphers";
import type {
  CipherFlowNode,
  CipherConfig,
  ExecutionStep,
  PipelineMode,
} from "@/types";

function sortedNodes(nodes: CipherFlowNode[]): CipherFlowNode[] {
  return [...nodes].sort((a, b) => a.data.order - b.data.order);
}

/**
 * Runs the pipeline in encrypt mode (first → last) or decrypt mode (last → first).
 * Each step records I/O for the trace panel.
 */
export function executePipeline(
  nodes: CipherFlowNode[],
  mode: PipelineMode,
  input: string,
): { trace: ExecutionStep[]; output: string; ok: boolean } {
  const ordered = sortedNodes(nodes);
  const trace: ExecutionStep[] = [];
  let current = input;
  let ok = true;

  const sequence =
    mode === "encrypt"
      ? ordered
      : [...ordered].reverse();

  for (const node of sequence) {
    const def = getCipherOrThrow(node.data.cipherId);
    const config = node.data.config as CipherConfig;
    const stepBase = {
      nodeId: node.id,
      nodeType: def.id,
      config: { ...config },
      input: current,
      success: true as boolean,
    };

    try {
      const out =
        mode === "encrypt"
          ? def.encrypt(current, config as never)
          : def.decrypt(current, config as never);
      trace.push({
        ...stepBase,
        output: out,
        success: true,
      });
      current = out;
    } catch (e) {
      ok = false;
      const msg = e instanceof Error ? e.message : String(e);
      trace.push({
        ...stepBase,
        output: "",
        success: false,
        error: msg,
      });
      break;
    }
  }

  return { trace, output: current, ok };
}
