import type { CipherDefinition, CipherConfig } from "@/types";

import { base64Cipher } from "./base64cipher";
import { caesarCipher } from "./caesar";
import { railFenceCipher } from "./railfence";
import { reverseCipher } from "./reverse";
import { vigenereCipher } from "./vigenere";
import { xorCipher } from "./xor";

/** All registered ciphers — add new entries here to extend the app. */
export const CIPHER_LIST: CipherDefinition<Record<string, unknown>>[] = [
  caesarCipher,
  xorCipher,
  vigenereCipher,
  railFenceCipher,
  base64Cipher,
  reverseCipher,
];

const byId = new Map<string, CipherDefinition<Record<string, unknown>>>(
  CIPHER_LIST.map((c) => [c.id, c]),
);

export function getCipher(
  id: string,
): CipherDefinition<Record<string, unknown>> | undefined {
  return byId.get(id);
}

export function getCipherOrThrow(
  id: string,
): CipherDefinition<Record<string, unknown>> {
  const c = getCipher(id);
  if (!c) throw new Error(`Unknown cipher: ${id}`);
  return c;
}

/** Validates and normalizes config for a cipher id. */
export function validateCipherConfig(
  cipherId: string,
  raw: unknown,
):
  | { ok: true; config: CipherConfig }
  | { ok: false; errors: string[] } {
  const def = getCipher(cipherId);
  if (!def) return { ok: false, errors: [`Unknown cipher: ${cipherId}`] };
  const r = def.validateConfig(raw);
  if (!r.valid) return { ok: false, errors: r.errors };
  return { ok: true, config: r.config as CipherConfig };
}
