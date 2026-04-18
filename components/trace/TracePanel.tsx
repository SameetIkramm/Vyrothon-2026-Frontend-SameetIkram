"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getCipher } from "@/lib/ciphers";
import { useCipherStore } from "@/store/useCipherStore";

export function TracePanel() {
  const trace = useCipherStore((s) => s.executionTrace);
  const mode = useCipherStore((s) => s.mode);
  const stepHighlight = useCipherStore((s) => s.stepHighlight);
  const animateTrace = useCipherStore((s) => s.animateTrace);

  return (
    <Card className="border-border/70">
      <CardHeader className="flex flex-col gap-3 pb-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="text-sm">Execution trace</CardTitle>
          <CardDescription>
            Every hop shows intermediate input and output for the active mode (
            {mode}).
          </CardDescription>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="w-full shrink-0 gap-1 sm:w-auto"
          disabled={!trace.length}
          onClick={() => animateTrace()}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Animate
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[220px] max-h-[45vh] sm:h-[280px] sm:max-h-none lg:h-[320px]">
          <div className="space-y-2 px-4 pb-4">
            {trace.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Run the pipeline to populate a step-by-step trace.
              </p>
            )}
            <AnimatePresence initial={false}>
              {trace.map((step, idx) => {
                const name = getCipher(step.nodeType)?.name ?? step.nodeType;
                const active = stepHighlight === idx;
                return (
                  <motion.div
                    key={`${step.nodeId}-${idx}`}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: active ? 1.01 : 1,
                    }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                    className={`rounded-lg border p-3 text-xs ${
                      active
                        ? "border-primary/70 bg-primary/10 shadow-sm"
                        : "border-border/70 bg-secondary/20"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="font-mono text-[10px]">
                        {idx + 1}. {name}
                      </Badge>
                      {!step.success && (
                        <Badge variant="destructive" className="text-[10px]">
                          failed
                        </Badge>
                      )}
                    </div>
                    <Separator className="my-2 bg-border/70" />
                    <div className="space-y-1.5 font-mono text-[11px] leading-relaxed">
                      <div>
                        <span className="text-muted-foreground">In · </span>
                        <span className="break-all">{step.input}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Out · </span>
                        <span className="break-all">
                          {step.success ? step.output : "—"}
                        </span>
                      </div>
                      {step.error && (
                        <p className="text-destructive">{step.error}</p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
