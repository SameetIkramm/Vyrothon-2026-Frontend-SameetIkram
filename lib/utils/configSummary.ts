import { getCipher } from "@/lib/ciphers";
import type { CipherConfig } from "@/types";

export function configSummary(cipherId: string, config: CipherConfig): string {
  const def = getCipher(cipherId);
  if (!def) return "Unknown";
  if (!def.isConfigurable) return "default";

  switch (cipherId) {
    case "caesar":
      return `shift ${config.shift}`;
    case "xor":
      return `key len ${String(config.key).length}`;
    case "vigenere":
      return `kw "${String(config.keyword).slice(0, 12)}${String(config.keyword).length > 12 ? "…" : ""}"`;
    case "railfence":
      return `rails ${config.rails}`;
    default:
      return JSON.stringify(config);
  }
}
