import type { CipherConfig, CipherDefinition, ValidationResult } from "@/types";

function toBase64(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function fromBase64(input: string): string {
  const binary = atob(input);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

export const base64Cipher: CipherDefinition<CipherConfig> = {
  id: "base64",
  name: "Base64",
  description: "Encodes text as Base64 (UTF-8). Config-free.",
  isConfigurable: false,
  defaultConfig: {},
  validateConfig(config: unknown): ValidationResult<CipherConfig> {
    if (config !== null && typeof config !== "object") {
      return { valid: false, errors: ["Config must be an object."] };
    }
    return { valid: true, config: {} };
  },
  encrypt(input: string): string {
    return toBase64(input);
  },
  decrypt(input: string): string {
    const trimmed = input.replace(/\s/g, "");
    try {
      return fromBase64(trimmed);
    } catch {
      throw new Error("Invalid Base64 input.");
    }
  },
};
