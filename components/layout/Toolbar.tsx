"use client";

import {
  Download,
  Eraser,
  Play,
  RotateCcw,
  Upload,
} from "lucide-react";
import { useRef, type ChangeEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { hasBlockingErrors } from "@/lib/validation/pipeline";
import { useCipherStore } from "@/store/useCipherStore";

export function Toolbar() {
  const mode = useCipherStore((s) => s.mode);
  const setMode = useCipherStore((s) => s.setMode);
  const run = useCipherStore((s) => s.runPipeline);
  const clear = useCipherStore((s) => s.clearOutput);
  const reset = useCipherStore((s) => s.resetSample);
  const exportJson = useCipherStore((s) => s.exportPipeline);
  const importJson = useCipherStore((s) => s.importPipeline);
  const errors = useCipherStore((s) => s.validationErrors);

  const fileRef = useRef<HTMLInputElement>(null);

  const blocked = hasBlockingErrors(errors);

  const handleRun = () => {
    if (blocked) {
      toast.error("Fix validation issues before running.");
      return;
    }
    run();
    const after = useCipherStore.getState();
    if (after.runStatus === "success") {
      toast.success("Pipeline finished successfully.");
    } else if (after.runStatus === "error") {
      toast.error("Pipeline stopped with an error — see trace.");
    }
  };

  const handleExport = () => {
    const json = exportJson();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cipherstack-pipeline.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Pipeline exported.");
  };

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const text = await file.text();
    const res = importJson(text);
    if (res.ok) toast.success(res.message);
    else toast.error(res.message);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border/70 bg-card/60 px-3 py-2 backdrop-blur-sm">
      <Tabs
        value={mode}
        onValueChange={(v) => setMode(v as "encrypt" | "decrypt")}
      >
        <TabsList className="h-9">
          <TabsTrigger value="encrypt" className="px-4 text-xs">
            Encrypt
          </TabsTrigger>
          <TabsTrigger value="decrypt" className="px-4 text-xs">
            Decrypt
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Separator orientation="vertical" className="mx-1 hidden h-7 md:block" />

      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <Button
              type="button"
              size="sm"
              className="gap-1.5"
              onClick={handleRun}
            >
              <Play className="h-3.5 w-3.5" />
              Run
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          {blocked
            ? "Resolve validation errors first."
            : "Execute the full pipeline in the selected mode."}
        </TooltipContent>
      </Tooltip>

      <Button
        type="button"
        size="sm"
        variant="secondary"
        className="gap-1.5"
        onClick={() => {
          clear();
          toast.message("Output and trace cleared.");
        }}
      >
        <Eraser className="h-3.5 w-3.5" />
        Clear
      </Button>

      <Button
        type="button"
        size="sm"
        variant="secondary"
        className="gap-1.5"
        onClick={() => {
          reset();
          toast.success("Sample pipeline restored.");
        }}
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Reset sample
      </Button>

      <Separator orientation="vertical" className="mx-1 hidden h-7 lg:block" />

      <Button
        type="button"
        size="sm"
        variant="outline"
        className="gap-1.5"
        onClick={handleExport}
      >
        <Download className="h-3.5 w-3.5" />
        Export
      </Button>

      <Button
        type="button"
        size="sm"
        variant="outline"
        className="gap-1.5"
        onClick={() => fileRef.current?.click()}
      >
        <Upload className="h-3.5 w-3.5" />
        Import
      </Button>
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={onFile}
      />
    </div>
  );
}
