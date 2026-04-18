import type { CipherDefinition, ValidationResult } from "@/types";

export interface RailFenceConfig extends Record<string, unknown> {
  rails: number;
}

function zigzagEncrypt(text: string, rails: number): string {
  const rows: string[] = Array.from({ length: rails }, () => "");
  let r = 0;
  let dir = 1;
  for (let i = 0; i < text.length; i++) {
    rows[r] += text[i];
    r += dir;
    if (r === 0 || r === rails - 1) dir *= -1;
  }
  return rows.join("");
}

function zigzagDecrypt(text: string, rails: number): string {
  const len = text.length;
  const counts = new Array(rails).fill(0);
  let r = 0;
  let dir = 1;
  for (let i = 0; i < len; i++) {
    counts[r]++;
    r += dir;
    if (r === 0 || r === rails - 1) dir *= -1;
  }
  const rowStrings: string[] = [];
  let offset = 0;
  for (let row = 0; row < rails; row++) {
    rowStrings.push(text.slice(offset, offset + counts[row]));
    offset += counts[row];
  }
  const ptrs = new Array(rails).fill(0);
  r = 0;
  dir = 1;
  let out = "";
  for (let i = 0; i < len; i++) {
    out += rowStrings[r][ptrs[r]++];
    r += dir;
    if (r === 0 || r === rails - 1) dir *= -1;
  }
  return out;
}

export const railFenceCipher: CipherDefinition<RailFenceConfig> = {
  id: "railfence",
  name: "Rail Fence",
  description: "Writes text in a zigzag across a number of rails, then reads row-wise.",
  isConfigurable: true,
  defaultConfig: { rails: 3 },
  validateConfig(config: unknown): ValidationResult<RailFenceConfig> {
    if (config === null || typeof config !== "object") {
      return { valid: false, errors: ["Config must be an object."] };
    }
    const c = config as Record<string, unknown>;
    if (typeof c.rails !== "number" || !Number.isFinite(c.rails)) {
      return { valid: false, errors: ["Rails must be a finite number."] };
    }
    if (!Number.isInteger(c.rails)) {
      return { valid: false, errors: ["Rails must be an integer."] };
    }
    if (c.rails < 2) {
      return { valid: false, errors: ["Rails must be at least 2."] };
    }
    return { valid: true, config: { rails: c.rails } };
  },
  encrypt(input: string, config: RailFenceConfig): string {
    return zigzagEncrypt(input, config.rails);
  },
  decrypt(input: string, config: RailFenceConfig): string {
    return zigzagDecrypt(input, config.rails);
  },
};
