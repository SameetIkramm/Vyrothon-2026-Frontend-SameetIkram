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
        <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-3 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3 sm:px-4 sm:py-2">
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex min-w-0 items-center gap-2 sm:gap-3"
          >
            <Image
              src="/images/logo.png"
              alt=""
              width={128}
              height={128}
              className="h-14 w-14 shrink-0 object-contain sm:h-20 sm:w-20 lg:h-28 lg:w-28 xl:h-32 xl:w-32"
              priority
            />
            <h1 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
              CipherStack
            </h1>
          </motion.div>
          <div className="min-w-0 sm:shrink-0 sm:self-center">
            <Toolbar />
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-[1600px] flex-col gap-6 px-3 py-4 sm:px-4 sm:py-6 lg:grid lg:h-[calc(100dvh-10rem)] lg:min-h-0 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)_minmax(0,340px)] lg:grid-rows-1 lg:gap-6 xl:h-[calc(100dvh-11rem)]">
        <aside className="order-3 space-y-4 lg:sticky lg:order-none lg:top-6 lg:min-h-0 lg:max-h-full lg:overflow-y-auto lg:self-start">
          <CipherLibrary />
          <InspectorPanel />
        </aside>

        <section className="order-1 flex min-h-0 min-w-0 flex-col gap-4 lg:order-none lg:min-h-0 lg:overflow-hidden">
          <ValidationBanner />
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="min-h-[min(55vh,420px)] flex-1 sm:min-h-[min(50vh,480px)] lg:min-h-0"
          >
            <PipelineCanvas />
          </motion.div>
        </section>

        <aside className="order-2 space-y-4 lg:sticky lg:order-none lg:top-6 lg:min-h-0 lg:max-h-full lg:overflow-y-auto lg:self-start">
          <InputPanel />
          <OutputPanel />
          <TracePanel />
        </aside>
      </main>
    </div>
  );
}
