"use client";

import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getCipher } from "@/lib/ciphers";
import { useCipherStore } from "@/store/useCipherStore";

export function InspectorPanel() {
  const selectedId = useCipherStore((s) => s.selectedNodeId);
  const nodes = useCipherStore((s) => s.nodes);
  const errors = useCipherStore((s) => s.validationErrors.nodes);
  const update = useCipherStore((s) => s.updateNodeConfig);

  const node = nodes.find((n) => n.id === selectedId);
  const def = node ? getCipher(node.data.cipherId) : undefined;
  const nodeErrs = node ? errors[node.id] : undefined;

  if (!node || !def) {
    return (
      <Card className="border-dashed border-border/80 bg-secondary/20">
        <CardHeader>
          <CardTitle className="text-sm">Inspector</CardTitle>
          <CardDescription>
            Select a node on the canvas to edit its parameters.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const cfg = node.data.config;

  return (
    <motion.div layout key={node.id}>
      <Card className="border-border/70">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-sm">Inspector</CardTitle>
            <Badge variant="secondary" className="font-mono text-[10px]">
              #{node.data.order + 1}
            </Badge>
          </div>
          <CardDescription>{def.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {def.isConfigurable ? (
            <>
              {def.id === "caesar" && (
                <div className="space-y-2">
                  <Label htmlFor="shift">Shift (integer)</Label>
                  <Input
                    id="shift"
                    inputMode="numeric"
                    value={String(cfg.shift ?? "")}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "" || v === "-") {
                        update(node.id, { shift: 0 });
                        return;
                      }
                      const n = Number.parseInt(v, 10);
                      if (!Number.isNaN(n)) update(node.id, { shift: n });
                    }}
                  />
                </div>
              )}
              {def.id === "xor" && (
                <div className="space-y-2">
                  <Label htmlFor="xor-key">Key</Label>
                  <Input
                    id="xor-key"
                    value={String(cfg.key ?? "")}
                    onChange={(e) => update(node.id, { key: e.target.value })}
                    className="font-mono text-xs"
                  />
                </div>
              )}
              {def.id === "vigenere" && (
                <div className="space-y-2">
                  <Label htmlFor="kw">Keyword</Label>
                  <Input
                    id="kw"
                    value={String(cfg.keyword ?? "")}
                    onChange={(e) =>
                      update(node.id, { keyword: e.target.value })
                    }
                    className="font-mono text-xs"
                    placeholder="Letters only recommended"
                  />
                </div>
              )}
              {def.id === "railfence" && (
                <div className="space-y-2">
                  <Label htmlFor="rails">Rails (≥ 2)</Label>
                  <Input
                    id="rails"
                    inputMode="numeric"
                    value={String(cfg.rails ?? "")}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "") {
                        update(node.id, { rails: 2 });
                        return;
                      }
                      const n = Number.parseInt(v, 10);
                      if (!Number.isNaN(n)) update(node.id, { rails: n });
                    }}
                  />
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              This cipher has no user-facing parameters.
            </p>
          )}

          {nodeErrs && nodeErrs.length > 0 && (
            <>
              <Separator />
              <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                <p className="font-medium">Configuration issues</p>
                <ul className="mt-1 list-disc pl-4">
                  {nodeErrs.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
