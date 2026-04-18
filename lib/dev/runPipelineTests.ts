/**
 * Dev utility: run with `npm run test:pipelines`
 * Executes round-trip checks for bundled sample pipelines.
 */

import { createDefaultPipeline } from "../sample/defaultPipeline";
import { verifyRoundTrip } from "./pipelineRoundTrip";

const samples = [
  "Hello, CipherStack!",
  "ASCII-only pipeline test.",
  "Mixed: Café — テスト",
  "",
  "AAA",
];

const { nodes } = createDefaultPipeline();
const { ok, failures } = verifyRoundTrip(nodes, samples);

if (!ok) {
  console.error("Pipeline round-trip failures:");
  for (const f of failures) console.error(` - ${f}`);
  process.exit(1);
}

console.log(
  `✓ Default pipeline round-trip passed for ${samples.length} sample inputs.`,
);
