import type { CipherDefinition, ValidationResult } from "@/types";

export interface XorConfig extends Record<string, unknown> {
  key: string;
}

function xorCycle(input: string, key: string): string {
  let out = "";
  const klen = key.length;
  for (let i = 0; i < input.length; i++) {
    out += String.fromCharCode(
      input.charCodeAt(i) ^ key.charCodeAt(i % klen),
    );
  }
  return out;
}

export const xorCipher: CipherDefinition<XorConfig> = {
  id: "xor",
  name: "XOR",
  description: "Bitwise XOR of each code unit with a repeating key (symmetric).",
  isConfigurable: true,
  defaultConfig: { key: "K7" },
  validateConfig(config: unknown): ValidationResult<XorConfig> {
    if (config === null || typeof config !== "object") {
      return { valid: false, errors: ["Config must be an object."] };
    }
    const c = config as Record<string, unknown>;
    if (typeof c.key !== "string" || c.key.length === 0) {
      return { valid: false, errors: ["Key must be a non-empty string."] };
    }
    return { valid: true, config: { key: c.key } };
  },
  encrypt(input: string, config: XorConfig): string {
    return xorCycle(input, config.key);
  },
  decrypt(input: string, config: XorConfig): string {
    return xorCycle(input, config.key);
  },
};
