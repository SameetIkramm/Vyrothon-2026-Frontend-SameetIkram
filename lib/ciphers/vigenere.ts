import type { CipherDefinition, ValidationResult } from "@/types";

export interface VigenereConfig extends Record<string, unknown> {
  keyword: string;
}

function sanitizeKeyword(raw: string): string {
  return raw.replace(/[^a-zA-Z]/g, "").toUpperCase();
}

function encryptChar(c: string, k: string, ki: number): { out: string; nextKi: number } {
  if (/[A-Z]/.test(c)) {
    const shift = k.charCodeAt(ki % k.length) - 65;
    const nextKi = ki + 1;
    return {
      out: String.fromCharCode((((c.charCodeAt(0) - 65 + shift) % 26) + 26) % 26 + 65),
      nextKi,
    };
  }
  if (/[a-z]/.test(c)) {
    const shift = k.charCodeAt(ki % k.length) - 65;
    const nextKi = ki + 1;
    return {
      out: String.fromCharCode((((c.charCodeAt(0) - 97 + shift) % 26) + 26) % 26 + 97),
      nextKi,
    };
  }
  return { out: c, nextKi: ki };
}

function decryptChar(c: string, k: string, ki: number): { out: string; nextKi: number } {
  if (/[A-Z]/.test(c)) {
    const shift = k.charCodeAt(ki % k.length) - 65;
    const nextKi = ki + 1;
    return {
      out: String.fromCharCode((((c.charCodeAt(0) - 65 - shift) % 26) + 26) % 26 + 65),
      nextKi,
    };
  }
  if (/[a-z]/.test(c)) {
    const shift = k.charCodeAt(ki % k.length) - 65;
    const nextKi = ki + 1;
    return {
      out: String.fromCharCode((((c.charCodeAt(0) - 97 - shift) % 26) + 26) % 26 + 97),
      nextKi,
    };
  }
  return { out: c, nextKi: ki };
}

export const vigenereCipher: CipherDefinition<VigenereConfig> = {
  id: "vigenere",
  name: "Vigenère",
  description: "Polyalphabetic substitution using a keyword (Latin letters only; others unchanged).",
  isConfigurable: true,
  defaultConfig: { keyword: "LEMON" },
  validateConfig(config: unknown): ValidationResult<VigenereConfig> {
    if (config === null || typeof config !== "object") {
      return { valid: false, errors: ["Config must be an object."] };
    }
    const c = config as Record<string, unknown>;
    if (typeof c.keyword !== "string") {
      return { valid: false, errors: ["Keyword must be a string."] };
    }
    const kw = sanitizeKeyword(c.keyword);
    if (kw.length === 0) {
      return {
        valid: false,
        errors: ["Keyword must contain at least one letter (A–Z or a–z)."],
      };
    }
    return { valid: true, config: { keyword: kw } };
  },
  encrypt(input: string, config: VigenereConfig): string {
    const k = sanitizeKeyword(config.keyword);
    let ki = 0;
    let out = "";
    for (const ch of input) {
      const r = encryptChar(ch, k, ki);
      out += r.out;
      ki = r.nextKi;
    }
    return out;
  },
  decrypt(input: string, config: VigenereConfig): string {
    const k = sanitizeKeyword(config.keyword);
    let ki = 0;
    let out = "";
    for (const ch of input) {
      const r = decryptChar(ch, k, ki);
      out += r.out;
      ki = r.nextKi;
    }
    return out;
  },
};
