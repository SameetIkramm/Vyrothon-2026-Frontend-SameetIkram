"use client";

import { useEffect } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { useCipherStore } from "@/store/useCipherStore";

export function CipherApp() {
  const hydrate = useCipherStore((s) => s.hydrateDefault);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return <AppShell />;
}
