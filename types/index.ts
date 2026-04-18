import type { Edge, Node } from "@xyflow/react";

/** Serializable cipher configuration (per node instance). */
export type CipherConfig = Record<string, string | number | boolean>;

export type ValidationResult<T extends Record<string, unknown>> =
  | { valid: true; config: T }
  | { valid: false; errors: string[] };

/**
 * Pluggable cipher contract. Add new ciphers by implementing this and registering in lib/ciphers/index.ts.
 * Config types are per-cipher plain objects; values should stay JSON-serializable.
 */
export interface CipherDefinition<
  T extends Record<string, unknown> = CipherConfig,
> {
  id: string;
  name: string;
  description: string;
  isConfigurable: boolean;
  defaultConfig: T;
  validateConfig(config: unknown): ValidationResult<T>;
  encrypt(input: string, config: T): string;
  decrypt(input: string, config: T): string;
}

export type PipelineMode = "encrypt" | "decrypt";

export interface ExecutionStep {
  nodeId: string;
  nodeType: string;
  config: CipherConfig;
  input: string;
  output: string;
  success: boolean;
  error?: string;
}

export type RunStatus = "idle" | "running" | "success" | "error";

export interface CipherNodeData extends Record<string, unknown> {
  cipherId: string;
  label: string;
  order: number;
  config: CipherConfig;
}

export type CipherFlowNode = Node<CipherNodeData, "cipher">;

export interface PipelineExport {
  version: 1;
  name: string;
  mode: PipelineMode;
  nodes: Array<{
    id: string;
    type: "cipher";
    position: { x: number; y: number };
    data: CipherNodeData;
  }>;
  edges: Edge[];
  plaintext?: string;
}

export interface ValidationErrorsState {
  pipeline: string[];
  nodes: Record<string, string[]>;
}
