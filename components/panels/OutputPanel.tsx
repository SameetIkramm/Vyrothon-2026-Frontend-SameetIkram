"use client";

import { Check, Copy } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useCipherStore } from "@/store/useCipherStore";

export function OutputPanel() {
  const finalOutput = useCipherStore((s) => s.finalOutput);
  const runStatus = useCipherStore((s) => s.runStatus);
  const mode = useCipherStore((s) => s.mode);
  const [copied, setCopied] = useState(false);

  const title =
    mode === "encrypt" ? "Ciphertext / encoded output" : "Recovered plaintext";

  const copy = async () => {
    if (!finalOutput) {
      toast.message("Nothing to copy yet.");
      return;
    }
    try {
      await navigator.clipboard.writeText(finalOutput);
      setCopied(true);
      toast.success("Copied to clipboard.");
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Clipboard unavailable.");
    }
  };

  return (
    <motion.div layout>
      <Card className="border-border/70">
        <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
          <div>
            <CardTitle className="text-sm">Output</CardTitle>
            <CardDescription>
              {runStatus === "success"
                ? "Latest pipeline run completed successfully."
                : runStatus === "error"
                  ? "Run blocked or failed — check validation and trace."
                  : "Run the pipeline to see results here."}
            </CardDescription>
          </div>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="shrink-0 gap-1.5"
            onClick={copy}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            Copy
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <Textarea
            readOnly
            value={finalOutput}
            placeholder="Output appears after a successful run."
            className="min-h-[68px] max-h-[132px] resize-y overflow-y-auto font-mono text-xs leading-relaxed"
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
