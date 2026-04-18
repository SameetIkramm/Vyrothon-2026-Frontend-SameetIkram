"use client";

import { motion } from "framer-motion";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCipherStore } from "@/store/useCipherStore";

export function InputPanel() {
  const mode = useCipherStore((s) => s.mode);
  const plaintext = useCipherStore((s) => s.plaintext);
  const setPlaintext = useCipherStore((s) => s.setPlaintext);

  const label = mode === "encrypt" ? "Plaintext" : "Ciphertext";
  const hint =
    mode === "encrypt"
      ? "Text to encrypt through the pipeline."
      : "Text to decrypt — nodes execute in reverse with decrypt().";

  return (
    <motion.div layout>
      <Card className="border-border/70">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Input</CardTitle>
          <CardDescription>{hint}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor="io-input">{label}</Label>
          <Textarea
            id="io-input"
            value={plaintext}
            onChange={(e) => setPlaintext(e.target.value)}
            spellCheck={false}
            className="min-h-[68px] max-h-[132px] resize-y overflow-y-auto font-mono text-xs leading-relaxed"
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
