"use client";

import { AlertTriangle } from "lucide-react";

import { useCipherStore } from "@/store/useCipherStore";

export function ValidationBanner() {
  const pipeline = useCipherStore((s) => s.validationErrors.pipeline);

  if (!pipeline.length) return null;

  return (
    <div className="flex min-w-0 gap-3 rounded-lg border border-amber-500/35 bg-amber-500/10 px-3 py-3 text-sm text-amber-100 sm:px-4">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
      <ul className="min-w-0 list-disc space-y-1 break-words pl-4">
        {pipeline.map((msg) => (
          <li key={msg}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}
