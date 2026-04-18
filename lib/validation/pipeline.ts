import { getCipher } from "@/lib/ciphers";
import type { CipherFlowNode, ValidationErrorsState } from "@/types";
import { validateCipherConfig } from "@/lib/ciphers";

const MIN_CONFIGURABLE = 3;

export function countConfigurableNodes(nodes: CipherFlowNode[]): number {
  return nodes.filter((n) => getCipher(n.data.cipherId)?.isConfigurable).length;
}

export function validatePipelineForRun(nodes: CipherFlowNode[]): ValidationErrorsState {
  const pipeline: string[] = [];
  const nodesErrors: Record<string, string[]> = {};

  if (nodes.length === 0) {
    pipeline.push("Add at least one cipher node to the pipeline.");
  }

  const cfgCount = countConfigurableNodes(nodes);
  if (cfgCount < MIN_CONFIGURABLE) {
    pipeline.push(
      `Add at least ${MIN_CONFIGURABLE} configurable cipher nodes (currently ${cfgCount}).`,
    );
  }

  const sorted = [...nodes].sort((a, b) => a.data.order - b.data.order);
  for (const node of sorted) {
    const errs: string[] = [];
    const def = getCipher(node.data.cipherId);
    if (!def) {
      errs.push(`Unknown cipher type: ${node.data.cipherId}`);
    } else {
      const v = validateCipherConfig(node.data.cipherId, node.data.config);
      if (!v.ok) errs.push(...v.errors);
    }
    if (errs.length) nodesErrors[node.id] = errs;
  }

  return { pipeline, nodes: nodesErrors };
}

export function hasBlockingErrors(errors: ValidationErrorsState): boolean {
  if (errors.pipeline.length > 0) return true;
  return Object.keys(errors.nodes).length > 0;
}
