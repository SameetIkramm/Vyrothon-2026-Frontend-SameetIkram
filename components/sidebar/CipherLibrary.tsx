"use client";

import { Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CIPHER_LIST } from "@/lib/ciphers";
import { useCipherStore } from "@/store/useCipherStore";

export function CipherLibrary() {
  const add = useCipherStore((s) => s.addCipherNode);

  return (
    <Card className="border-border/70">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Cipher library</CardTitle>
        <CardDescription>
          Add nodes to the stack. Order follows top-to-bottom on the canvas.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[280px] px-4 pb-4">
          <ul className="space-y-2">
            {CIPHER_LIST.map((c) => (
              <li
                key={c.id}
                className="flex items-start gap-2 rounded-lg border border-border/60 bg-secondary/25 p-2.5"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium">{c.name}</p>
                    <Badge variant="outline" className="text-[10px]">
                      {c.isConfigurable ? "configurable" : "fixed"}
                    </Badge>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {c.description}
                  </p>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      size="icon"
                      variant="secondary"
                      className="shrink-0"
                      onClick={() => add(c.id)}
                      aria-label={`Add ${c.name}`}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Add to pipeline</TooltipContent>
                </Tooltip>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
