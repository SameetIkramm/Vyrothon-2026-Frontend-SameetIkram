import type { CipherConfig, CipherDefinition, ValidationResult } from "@/types";

export const reverseCipher: CipherDefinition<CipherConfig> = {
  id: "reverse",
  name: "Reverse",
  description: "Reverses the full string (involution — same op for encrypt/decrypt).",
  isConfigurable: false,
  defaultConfig: {},
  validateConfig(config: unknown): ValidationResult<CipherConfig> {
    if (config !== null && typeof config !== "object") {
      return { valid: false, errors: ["Config must be an object."] };
    }
    return { valid: true, config: {} };
  },
  encrypt(input: string): string {
    return [...input].reverse().join("");
  },
  decrypt(input: string): string {
    return [...input].reverse().join("");
  },
};
