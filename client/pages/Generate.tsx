import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { addRecord } from "@/lib/history";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Check,
  ChevronLeft,
  CloudUpload,
  Loader2,
  RefreshCw,
  Sparkles,
  X,
} from "lucide-react";

type PosePackage = {
  id: string;
  name: string;
};

const POSE_PACKAGES: PosePackage[] = [
  {
    id: "Candid Face to Face Event Speaker",
    name: "Candid Face to Face Event Speaker",
  },
  { id: "Standard Photoshoot", name: "Standard Photoshoot" },
  { id: "Smiling", name: "Smiling" },
  { id: "Serious", name: "Serious" },
];

export default function Generate() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
    null,
  );
  const [previewPackageId, setPreviewPackageId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [advanceOnFile, setAdvanceOnFile] = useState(false);
  const [advanceOnPackage, setAdvanceOnPackage] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  // Derive selected package
  const selectedPackage = useMemo(
    () => POSE_PACKAGES.find((p) => p.id === selectedPackageId) ?? null,
    [selectedPackageId],
  );

  useEffect(() => {
    if (advanceOnPackage && selectedPackageId && step === 1) {
      setStep(2);
      setAdvanceOnPackage(false);
    }
  }, [advanceOnPackage, selectedPackageId, step]);

  useEffect(() => {
    if (advanceOnFile && file && step === 2) {
      setStep(3);
      setAdvanceOnFile(false);
    }
  }, [advanceOnFile, file, step]);

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f && f.size <= 10 * 1024 * 1024) {
      setAdvanceOnFile(true);
      setFile(f);
    }
  };

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && f.size <= 10 * 1024 * 1024) {
      setAdvanceOnFile(true);
      setFile(f);
    }
  };

  useEffect(() => {
    if (!file) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function extractImageUrls(data: any): string[] {
    if (!data) return [];
    if (Array.isArray(data)) {
      const out: string[] = [];
      for (const item of data) {
        if (typeof item === "string") out.push(item);
        else if (item && typeof item === "object") {
          const obj = item as Record<string, any>;
          if (typeof obj.secure_url === "string") out.push(obj.secure_url);
          else if (typeof obj.url === "string") out.push(obj.url);
        }
      }
      return out;
    }
    if (typeof data === "object") {
      const keys = ["urls", "images", "results", "data", "output"];
      for (const k of keys) {
        const v = (data as any)[k];
        const extracted = extractImageUrls(v);
        if (extracted.length) return extracted;
      }
    }
    if (typeof data === "string") {
      try {
        const parsed = JSON.parse(data);
        return extractImageUrls(parsed);
      } catch {
        return [];
      }
    }
    return [];
  }

  const runGenerate = async () => {
    setIsGenerating(true);

    let urls: string[] = [];
    try {
      const DEFAULT_WEBHOOK_URL =
        "https://n8n.srv931715.hstgr.cloud/webhook/virtual-photoshoot";
      const WEBHOOK_URL =
        ((import.meta as any).env?.VITE_WEBHOOK_URL as string | undefined) ??
        DEFAULT_WEBHOOK_URL;
      if (WEBHOOK_URL && selectedPackageId && file) {
        const fd = new FormData();
        fd.append("packageName", selectedPackage?.name ?? selectedPackageId);
        fd.append("file", file, file.name);
        const res = await fetch(WEBHOOK_URL, { method: "POST", body: fd });
        if (res.ok) {
          const ct = res.headers.get("content-type") || "";
          if (ct.includes("application/json")) {
            const data = await res.json();
            urls = extractImageUrls(data);
          } else {
            const text = await res.text();
            try {
              urls = extractImageUrls(JSON.parse(text));
            } catch {
              urls = [];
            }
          }
        }
      }
    } catch (e) {
      urls = [];
    }

    if (!urls || urls.length === 0) {
      urls = Array.from({ length: 4 }).map((_, i) =>
        `data:image/svg+xml;utf8,${encodeURIComponent(
          `<svg xmlns='http://www.w3.org/2000/svg' width='512' height='512'><rect width='100%' height='100%' fill='hsl(0,0%,92%)' /><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='hsl(0,0%,40%)' font-family='Inter' font-size='18'>Result ${
            i + 1
          }</text></svg>`,
        )}`,
      );
    }

    const finalImgs = urls.slice(0, 4);
    setResults(finalImgs);
    if (selectedPackageId) {
      addRecord({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: Date.now(),
        packageId: selectedPackageId,
        images: finalImgs,
      });
    }
    setIsGenerating(false);
  };

  const regenerateOne = async (index: number) => {
    const before = [...results];
    before[index] = "";
    setResults(before);
    await new Promise((r) => setTimeout(r, 600));
    before[index] = `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='512' height='512'><rect width='100%' height='100%' fill='hsl(0,0%,90%)' /><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='hsl(0,0%,30%)' font-family='Inter' font-size='18'>Refreshed ${
        index + 1
      }</text></svg>`,
    )}`;
    setResults([...before]);
  };

  return (
    <div className="p-4 md:p-8 space-y-8">
      <header className="flex items-center justify-between gap-2">
        <div>
          {step > 1 && (
            <Button
              variant="ghost"
              className="gap-2"
              onClick={() =>
                setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3) : s))
              }
            >
              <ChevronLeft className="size-4" /> Back
            </Button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span
            className={cn(
              "px-2 py-1 rounded bg-accent",
              step === 1 && "font-semibold text-foreground",
            )}
          >
            1. Choose Pose Package
          </span>
          <span>→</span>
          <span
            className={cn(
              "px-2 py-1 rounded bg-accent",
              step === 2 && "font-semibold text-foreground",
            )}
          >
            2. Upload Image
          </span>
          <span>→</span>
          <span
            className={cn(
              "px-2 py-1 rounded bg-accent",
              step === 3 && "font-semibold text-foreground",
            )}
          >
            3. Generate
          </span>
        </div>
        <div className="w-[88px]" />
      </header>

      {step === 1 && (
        <section aria-label="Choose Pose Package">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {POSE_PACKAGES.map((p) => (
              <button
                key={p.id}
                onClick={() => setPreviewPackageId(p.id)}
                className={cn(
                  "group relative rounded-lg border bg-card p-2 text-left transition hover:border-foreground/40",
                  selectedPackageId === p.id && "border-2",
                )}
              >
                <div className="aspect-square rounded-md bg-muted grid grid-cols-2 grid-rows-2 gap-1 p-1">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-gray-300" />
                  ))}
                </div>
                <div className="mt-2 text-sm">{p.name}</div>
                {selectedPackageId === p.id && (
                  <div className="absolute top-2 right-2 bg-foreground text-background rounded-full p-1">
                    <Check className="size-3" />
                  </div>
                )}
                <div className="absolute inset-0 rounded-lg border border-transparent group-hover:border-foreground/30 pointer-events-none" />
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Hover to preview poses on desktop. Tap to expand on mobile.
          </p>

          <Dialog
            open={!!previewPackageId}
            onOpenChange={(o) => !o && setPreviewPackageId(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {POSE_PACKAGES.find((pp) => pp.id === previewPackageId)
                    ?.name || "Pose Package"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-md bg-muted" />
                ))}
              </div>
              <div className="flex justify-end pt-2">
                <Button
                  onClick={() => {
                    if (previewPackageId)
                      setSelectedPackageId(previewPackageId);
                    setAdvanceOnPackage(true);
                    setPreviewPackageId(null);
                  }}
                >
                  Select
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <div className="pt-4 flex justify-end">
            <Button onClick={() => setStep(2)} disabled={!selectedPackageId}>
              Next
            </Button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section aria-label="Upload Image" className="space-y-4">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            className="relative border-2 border-dashed rounded-lg bg-card p-6 flex flex-col items-center justify-center text-center min-h-56 overflow-hidden"
          >
            {previewUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Uploaded preview"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <button
                  aria-label="Clear image"
                  onClick={() => {
                    setFile(null);
                    setResults([]);
                    setAdvanceOnFile(false);
                    setStep(2);
                  }}
                  className="absolute right-2 top-2 inline-flex items-center justify-center rounded-md bg-background/80 hover:bg-background/90 border px-2 py-1 text-xs"
                >
                  <X className="size-4" />
                </button>
              </>
            ) : (
              <>
                <CloudUpload className="size-8 text-muted-foreground mb-3" />
                <p className="text-sm">Drag and drop image here</p>
                <p className="text-xs text-muted-foreground">
                  Max size 10MB. JPG/PNG supported.
                </p>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <label className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={onInput}
                className="hidden"
              />
              <span className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer">
                <CloudUpload className="size-4" /> Upload
              </span>
            </label>
            {file && (
              <span className="text-xs text-muted-foreground truncate">
                Selected: {file.name}
              </span>
            )}
          </div>
          <div className="pt-2 flex justify-end">
            <Button onClick={() => setStep(3)} disabled={!file}>
              Next
            </Button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section aria-label="Generate" className="space-y-6">
          <div className="flex items-center justify-center gap-2">
            <Button
              onClick={runGenerate}
              disabled={isGenerating}
              className="h-12 px-6"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Generating
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  Generate
                </>
              )}
            </Button>
            <Button
              onClick={runGenerate}
              disabled={isGenerating}
              className="h-12 px-6"
            >
              Next
            </Button>
          </div>

          {isGenerating && (
            <div className="mx-auto max-w-xl h-2 bg-muted rounded overflow-hidden">
              <div className="h-full w-1/3 bg-foreground/60 animate-pulse" />
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {results.map((src, i) => (
                  <div
                    key={i}
                    className="rounded-lg border bg-card p-2 flex flex-col gap-2"
                  >
                    <div className="aspect-square rounded-md bg-muted overflow-hidden flex items-center justify-center">
                      {src ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={src}
                          alt={`Generated ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Loader2 className="size-6 animate-spin text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="secondary" className="flex-1">
                        Add to Library
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => regenerateOne(i)}
                      >
                        <RefreshCw className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-2">
                <Button variant="ghost" onClick={runGenerate} className="gap-2">
                  <Sparkles className="size-4" /> Generate Again with Same
                  Package
                </Button>
              </div>
            </div>
          )}

          {!results.length && !isGenerating && (
            <p className="text-center text-sm text-muted-foreground">
              Choose a package and upload an image to generate results.
            </p>
          )}
        </section>
      )}

      <footer className="pt-4 border-t text-xs text-muted-foreground">
        {selectedPackage ? (
          <div>
            Selected package:{" "}
            <span className="font-medium">{selectedPackage.name}</span>
          </div>
        ) : (
          <div>Select a package to begin.</div>
        )}
      </footer>
    </div>
  );
}
