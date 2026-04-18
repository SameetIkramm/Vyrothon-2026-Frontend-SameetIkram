"use client";

import { motion } from "framer-motion";
import Image from "next/image";

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
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-1">
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex min-w-0 items-center gap-3"
          >
            <Image
              src="/images/logo.png"
              alt=""
              width={128}
              height={128}
              className="h-32 w-32 shrink-0 object-contain"
              priority
            />
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              CipherStack
            </h1>
          </motion.div>
          <Toolbar />
        </div>
      </header>

      <main className="mx-auto grid max-w-[1600px] gap-6 px-4 py-6 lg:grid-cols-[280px_1fr_340px] lg:grid-rows-1 lg:h-[calc(100dvh-12rem)] lg:min-h-0">
        <aside className="space-y-4 lg:sticky lg:top-6 lg:min-h-0 lg:max-h-full lg:overflow-y-auto lg:self-start">
          <CipherLibrary />
          <InspectorPanel />
        </aside>

        <section className="flex h-full min-h-0 min-w-0 flex-col gap-4 lg:min-h-0 lg:overflow-hidden">
          <ValidationBanner />
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="min-h-[280px] flex-1 lg:min-h-0"
          >
            <PipelineCanvas />
          </motion.div>
        </section>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:min-h-0 lg:max-h-full lg:overflow-y-auto lg:self-start">
          <InputPanel />
          <OutputPanel />
          <TracePanel />
        </aside>
      </main>
    </div>
  );
}
