"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";

import { FlowProvider } from "./FlowProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delayDuration={200}>
      <FlowProvider>{children}</FlowProvider>
      <Toaster richColors position="top-right" theme="dark" />
    </TooltipProvider>
  );
}
