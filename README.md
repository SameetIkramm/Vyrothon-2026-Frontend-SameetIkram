# CipherStack

Production-style **node-based cascade encryption builder** for composing reversible cipher pipelines. Built for clarity, extensibility, and hackathon demos.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app loads a **preset demo pipeline** (four configurable ciphers) and sample plaintext.

```bash
npm run build        # production build
npm run test:pipelines   # round-trip checks (dev utility)
```

---

## Architecture

### Layers

| Layer | Role |
|--------|------|
| **`app/`** | Next.js App Router entry (`layout.tsx`, `page.tsx`), global styles. |
| **`components/`** | UI: layout shell, React Flow canvas, sidebar library, inspector, I/O panels, trace, shadcn-style primitives under `ui/`. |
| **`lib/ciphers/`** | Pluggable cipher definitions (id, validate, encrypt, decrypt). Registered in `lib/ciphers/index.ts`. |
| **`lib/engine/`** | **`executePipeline`**: runs nodes in order for **encrypt**, reverse order for **decrypt**, returns a full **execution trace**. |
| **`lib/validation/`** | Pipeline rules: minimum **3 configurable** nodes, per-node config validation via each cipher’s `validateConfig`. |
| **`store/`** | Zustand store: nodes/edges, mode, I/O, trace, validation snapshot, import/export. |
| **`types/`** | Shared TypeScript contracts (`CipherDefinition`, `ExecutionStep`, export format, etc.). |

### Execution model

- **Encrypt**: ordered by each node’s `data.order` (also reflected vertically on the canvas). Steps run **first → last** with `encrypt()`.
- **Decrypt**: same ordered list is iterated **last → first** with `decrypt()` so the stack inverts correctly.
- **Trace**: every hop records `nodeId`, `nodeType`, `config`, `input`, `output`, `success`, and optional `error`.

### State and React Flow

- **Logical order** is stored on `node.data.order`; edges are regenerated as a simple linear chain for a polished diagram.
- Nodes are **draggable**; reordering uses **move up / move down** on the card (and inspector context) so the sequence stays explicit.

### Import / export

- **Export** downloads JSON (`cipherstack-pipeline.json`) including nodes, edges, mode, and plaintext.
- **Import** reads the same schema (`version: 1`). See `lib/utils/importExport.ts`.

---

## How to add a new cipher

1. **Create** `lib/ciphers/myCipher.ts` implementing `CipherDefinition<T>` from `types/index.ts`:
   - `id`, `name`, `description`, `isConfigurable`
   - `defaultConfig` and `validateConfig`
   - `encrypt(input, config)` and `decrypt(input, config)` such that decrypt inverts encrypt for valid inputs
2. **Register** it in `CIPHER_LIST` inside `lib/ciphers/index.ts`.
3. **Optional UI**: extend `InspectorPanel` (`components/panels/InspectorPanel.tsx`) with inputs for your `cipherId`, and `configSummary` (`lib/utils/configSummary.ts`) for the node badge.

Configurable ciphers count toward the minimum of **three configurable nodes** required to run (`lib/validation/pipeline.ts`).

---

## Tech stack

- Next.js (App Router), React 19, TypeScript  
- Tailwind CSS v4, Radix-based UI primitives (shadcn-style)  
- `@xyflow/react` (React Flow), Zustand, Framer Motion, Sonner toasts  

---

## Dev utility: round-trip tests

`lib/dev/runPipelineTests.ts` runs `verifyRoundTrip` from `lib/dev/pipelineRoundTrip.ts` against the default pipeline and several sample strings (ASCII, empty, mixed scripts). Use `npm run test:pipelines` in CI or locally after cipher changes.

---

## Design notes

- Dark theme, restrained gradients, readable typography — **no gimmicky “hacker” chrome**.
- Validation errors surface in a **banner** (pipeline rules) and **per-node** callouts in the inspector.
