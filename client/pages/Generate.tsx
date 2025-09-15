import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, CloudUpload, Loader2, RefreshCw, Sparkles } from "lucide-react";

type PosePackage = {
  id: string;
  name: string;
};

const POSE_PACKAGES: PosePackage[] = [
  { id: "classic", name: "Classic" },
  { id: "dynamic", name: "Dynamic" },
  { id: "studio", name: "Studio" },
  { id: "action", name: "Action" },
  { id: "fashion", name: "Fashion" },
  { id: "portrait", name: "Portrait" },
];

export default function Generate() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
    null,
  );
  const [file, setFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  // Derive selected package
  const selectedPackage = useMemo(
    () => POSE_PACKAGES.find((p) => p.id === selectedPackageId) ?? null,
    [selectedPackageId],
  );

  useEffect(() => {
    if (selectedPackageId && step === 1) setStep(2);
  }, [selectedPackageId, step]);

  useEffect(() => {
    if (file && step === 2) setStep(3);
  }, [file, step]);

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f && f.size <= 10 * 1024 * 1024) setFile(f);
  };

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && f.size <= 10 * 1024 * 1024) setFile(f);
  };

  const runGenerate = async () => {
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 1200));
    // Create 4 gray placeholders with data URLs
    const imgs = Array.from({ length: 4 }).map((_, i) =>
      `data:image/svg+xml;utf8,${encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='512' height='512'><rect width='100%' height='100%' fill='hsl(0,0%,92%)' /><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='hsl(0,0%,40%)' font-family='Inter' font-size='18'>Result ${
          i + 1
        }</text></svg>`,
      )}`,
    );
    setResults(imgs);
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
      <header className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <span className={cn("px-2 py-1 rounded bg-accent", step === 1 && "font-semibold text-foreground")}>1. Choose Pose Package</span>
        <span>→</span>
        <span className={cn("px-2 py-1 rounded bg-accent", step === 2 && "font-semibold text-foreground")}>2. Upload Image</span>
        <span>→</span>
        <span className={cn("px-2 py-1 rounded bg-accent", step === 3 && "font-semibold text-foreground")}>3. Generate</span>
      </header>

      {step === 1 && (
        <section aria-label="Choose Pose Package">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {POSE_PACKAGES.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPackageId(p.id)}
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
          <p className="mt-4 text-xs text-muted-foreground">Hover to preview poses on desktop. Tap to expand on mobile.</p>
        </section>
      )}

      {step === 2 && (
        <section aria-label="Upload Image" className="space-y-4">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            className="border-2 border-dashed rounded-lg bg-card p-6 flex flex-col items-center justify-center text-center min-h-56"
          >
            <CloudUpload className="size-8 text-muted-foreground mb-3" />
            <p className="text-sm">Drag and drop image here</p>
            <p className="text-xs text-muted-foreground">Max size 10MB. JPG/PNG supported.</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="relative">
              <input type="file" accept="image/*" onChange={onInput} className="hidden" />
              <span className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer">
                <CloudUpload className="size-4" /> Upload
              </span>
            </label>
            {file && (
              <span className="text-xs text-muted-foreground truncate">Selected: {file.name}</span>
            )}
          </div>
        </section>
      )}

      {step === 3 && (
        <section aria-label="Generate" className="space-y-6">
          <div className="flex items-center justify-center">
            <Button onClick={runGenerate} disabled={isGenerating} className="h-12 px-6">
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
                  <div key={i} className="rounded-lg border bg-card p-2 flex flex-col gap-2">
                    <div className="aspect-square rounded-md bg-muted overflow-hidden flex items-center justify-center">
                      {src ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={src} alt={`Generated ${i + 1}`} className="w-full h-full object-cover" />
                      ) : (
                        <Loader2 className="size-6 animate-spin text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="secondary" className="flex-1">Add to Library</Button>
                      <Button variant="outline" onClick={() => regenerateOne(i)}>
                        <RefreshCw className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-2">
                <Button variant="ghost" onClick={runGenerate} className="gap-2">
                  <Sparkles className="size-4" /> Generate Again with Same Package
                </Button>
              </div>
            </div>
          )}

          {!results.length && !isGenerating && (
            <p className="text-center text-sm text-muted-foreground">Choose a package and upload an image to generate results.</p>
          )}
        </section>
      )}

      <footer className="pt-4 border-t text-xs text-muted-foreground">
        {selectedPackage ? (
          <div>
            Selected package: <span className="font-medium">{selectedPackage.name}</span>
          </div>
        ) : (
          <div>Select a package to begin.</div>
        )}
      </footer>
    </div>
  );
}
