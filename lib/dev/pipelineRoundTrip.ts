import { executePipeline } from "../engine/executePipeline";
import type { CipherFlowNode } from "../../types";

/**
 * Verifies encrypt → decrypt round-trip for a pipeline and sample strings.
 * Used by `npm run test:pipelines` and can be imported from dev tooling.
 */
export function verifyRoundTrip(
  nodes: CipherFlowNode[],
  samples: string[],
): { ok: boolean; failures: string[] } {
  const failures: string[] = [];

  for (const plain of samples) {
    const enc = executePipeline(nodes, "encrypt", plain);
    if (!enc.ok) {
      failures.push(`Encrypt failed for ${JSON.stringify(plain)}`);
      continue;
    }
    const dec = executePipeline(nodes, "decrypt", enc.output);
    if (!dec.ok) {
      failures.push(`Decrypt failed for ${JSON.stringify(plain)}`);
      continue;
    }
    if (dec.output !== plain) {
      failures.push(
        `Mismatch for ${JSON.stringify(plain)} → got ${JSON.stringify(dec.output)}`,
      );
    }
  }

  return { ok: failures.length === 0, failures };
}
