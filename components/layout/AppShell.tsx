"use client";

import { motion } from "framer-motion";
import { Shield } from "lucide-react";

import { CipherLibrary } from "@/components/sidebar/CipherLibrary";
import { InputPanel } from "@/components/panels/InputPanel";
import { OutputPanel } from "@/components/panels/OutputPanel";
import { InspectorPanel } from "@/components/panels/InspectorPanel";
import { PipelineCanvas } from "@/components/pipeline/PipelineCanvas";
import { TracePanel } from "@/components/trace/TracePanel";
import { ValidationBanner } from "@/components/layout/ValidationBanner";
import { Toolbar } from "@/components/layout/Toolbar";

export function AppShell() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/40">
      <header className="border-b border-border/70 bg-card/40 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-3">
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex min-w-0 items-center gap-3"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary shadow-inner">
              <Shield className="h-5 w-5" aria-hidden />
            </div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              CipherStack
            </h1>
          </motion.div>
          <Toolbar />
        </div>
      </header>

      <main className="mx-auto grid max-w-[1600px] gap-6 px-4 py-6 lg:grid-cols-[280px_1fr_340px]">
        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <CipherLibrary />
          <InspectorPanel />
        </aside>

        <section className="space-y-4 min-w-0">
          <ValidationBanner />
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="h-[520px] lg:h-[calc(100vh-168px)] lg:min-h-[480px]"
          >
            <PipelineCanvas />
          </motion.div>
          <div className="grid gap-4 md:grid-cols-2">
            <InputPanel />
            <OutputPanel />
          </div>
        </section>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <TracePanel />
          <div className="rounded-lg border border-dashed border-border/70 bg-secondary/15 px-3 py-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">Round-trip guarantee</p>
            <p className="mt-1 leading-relaxed">
              Encrypt with the stack, copy the ciphertext, switch to Decrypt, and
              paste — you should recover the original plaintext byte-for-byte when
              all configs stay identical.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
