import type { CipherDefinition, ValidationResult } from "@/types";

export interface CaesarConfig extends Record<string, unknown> {
  shift: number;
}

function shiftChar(c: string, shift: number): string {
  const code = c.charCodeAt(0);
  if (code >= 65 && code <= 90) {
    return String.fromCharCode((((code - 65 + shift) % 26) + 26) % 26 + 65);
  }
  if (code >= 97 && code <= 122) {
    return String.fromCharCode((((code - 97 + shift) % 26) + 26) % 26 + 97);
  }
  return c;
}

export const caesarCipher: CipherDefinition<CaesarConfig> = {
  id: "caesar",
  name: "Caesar",
  description: "Shifts Latin letters by a fixed offset; other characters pass through.",
  isConfigurable: true,
  defaultConfig: { shift: 3 },
  validateConfig(config: unknown): ValidationResult<CaesarConfig> {
    if (config === null || typeof config !== "object") {
      return { valid: false, errors: ["Config must be an object."] };
    }
    const c = config as Record<string, unknown>;
    if (typeof c.shift !== "number" || !Number.isFinite(c.shift)) {
      return { valid: false, errors: ["Shift must be a finite number."] };
    }
    if (!Number.isInteger(c.shift)) {
      return { valid: false, errors: ["Shift must be an integer."] };
    }
    return { valid: true, config: { shift: c.shift } };
  },
  encrypt(input: string, config: CaesarConfig): string {
    return [...input].map((ch) => shiftChar(ch, config.shift)).join("");
  },
  decrypt(input: string, config: CaesarConfig): string {
    return [...input].map((ch) => shiftChar(ch, -config.shift)).join("");
  },
};
