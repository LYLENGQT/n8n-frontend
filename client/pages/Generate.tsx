import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { addRecord } from "@/lib/history";
import { addAllToLibrary } from "@/lib/library";
import { toast } from "@/components/ui/use-toast";
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
  previews?: string[];
};

const CANDID_PREVIEWS: string[] = [
  ((import.meta as any).env?.VITE_CANDID_PREVIEW_1 as string) ||
    "https://res.cloudinary.com/dcxib2abj/image/upload/v1758183894/xlpv5uvpccewusp9v02b.png",
  ((import.meta as any).env?.VITE_CANDID_PREVIEW_2 as string) ||
    "https://res.cloudinary.com/dcxib2abj/image/upload/v1757927345/iwcg4vwoafaautnc6jrr.png",
  ((import.meta as any).env?.VITE_CANDID_PREVIEW_3 as string) ||
    "https://res.cloudinary.com/dcxib2abj/image/upload/v1757935393/rlb5ck2q10jdyr3kcyyf.png",
  ((import.meta as any).env?.VITE_CANDID_PREVIEW_4 as string) ||
    "https://res.cloudinary.com/dcxib2abj/image/upload/v1758182881/zrkkw7liogbm2gsyh12u.png",
];

const STANDARD_PREVIEWS: string[] = [
  ((import.meta as any).env?.VITE_STANDARD_PREVIEW_1 as string) ||
    "https://res.cloudinary.com/dcxib2abj/image/upload/v1757927503/eycykqcdejrtaugbeqmg.png",
  ((import.meta as any).env?.VITE_STANDARD_PREVIEW_2 as string) ||
    "https://res.cloudinary.com/dcxib2abj/image/upload/v1757933745/qyo1souc5cf4q4qzjaup.png",
  ((import.meta as any).env?.VITE_STANDARD_PREVIEW_3 as string) ||
    "https://res.cloudinary.com/dcxib2abj/image/upload/v1758182095/icwckivsfhcvzl5ssdau.png",
  ((import.meta as any).env?.VITE_STANDARD_PREVIEW_4 as string) ||
    "https://res.cloudinary.com/dcxib2abj/image/upload/v1758182624/us2vtp4shvw292uwmohs.png",
];

const SMILING_PREVIEWS: string[] = [
  ((import.meta as any).env?.VITE_SMILING_PREVIEW_1 as string) ||
    "https://res.cloudinary.com/dcxib2abj/image/upload/v1758188173/efs5ydrpkx6tuz2cnl5x.png",
  ((import.meta as any).env?.VITE_SMILING_PREVIEW_2 as string) ||
    "https://res.cloudinary.com/dcxib2abj/image/upload/v1758188468/my4ckhjfkqdudtitg03z.png",
  ((import.meta as any).env?.VITE_SMILING_PREVIEW_3 as string) ||
    "https://res.cloudinary.com/dcxib2abj/image/upload/v1757936249/grzk0cpjtjbhmofdts4c.png",
  ((import.meta as any).env?.VITE_SMILING_PREVIEW_4 as string) ||
    "https://res.cloudinary.com/dcxib2abj/image/upload/v1758182624/mtreedlwvn6miaqzgcgy.png",
];

const SERIOUS_PREVIEWS: string[] = [
  ((import.meta as any).env?.VITE_SERIOUS_PREVIEW_1 as string) ||
    "https://res.cloudinary.com/dcxib2abj/image/upload/v1758187806/ejp5rblbl81d92iolecs.png",
  ((import.meta as any).env?.VITE_SERIOUS_PREVIEW_2 as string) ||
    "https://res.cloudinary.com/dcxib2abj/image/upload/v1758186139/ukhzha0uw2jyci4vrwvv.png",
  ((import.meta as any).env?.VITE_SERIOUS_PREVIEW_3 as string) ||
    "https://res.cloudinary.com/dcxib2abj/image/upload/v1758176864/kanhrdgitooe19heghqu.png",
  ((import.meta as any).env?.VITE_SERIOUS_PREVIEW_4 as string) ||
    "https://res.cloudinary.com/dcxib2abj/image/upload/v1757935785/u2zgkz05q3hfp6w5nn25.png",
];

const CONTEMPORARY_FASHION_PREVIEWS: string[] = [
  ((import.meta as any).env?.VITE_CONTEMPORARY_FASHION_PREVIEW_1 as string) ||
    "https://res.cloudinary.com/dcxib2abj/image/upload/v1758003610/igkgavtkcgkozym1vjlt.png",
  ((import.meta as any).env?.VITE_CONTEMPORARY_FASHION_PREVIEW_2 as string) ||
    "https://res.cloudinary.com/dcxib2abj/image/upload/v1758003610/gb7q2yc6sgimkzqvdmke.png",
  ((import.meta as any).env?.VITE_CONTEMPORARY_FASHION_PREVIEW_3 as string) ||
    "https://res.cloudinary.com/dcxib2abj/image/upload/v1758003610/qengskktroikd9fpmh0n.png",
  ((import.meta as any).env?.VITE_CONTEMPORARY_FASHION_PREVIEW_4 as string) ||
    "https://res.cloudinary.com/dcxib2abj/image/upload/v1758003610/ns6vmh4881m3ufhbufma.png",
];

const EDITORIAL_PORTRAIT_PREVIEWS: string[] = [
  ((import.meta as any).env?.VITE_EDITORIAL_PORTRAIT_PREVIEW_1 as string) ||
    "https://res.cloudinary.com/dcxib2abj/image/upload/v1758004452/x2qioyh3hekl4fjqjya3.png",
  ((import.meta as any).env?.VITE_EDITORIAL_PORTRAIT_PREVIEW_2 as string) ||
    "https://res.cloudinary.com/dcxib2abj/image/upload/v1758003740/usx8nubmzb4kr0f06dlj.jpg",
  ((import.meta as any).env?.VITE_EDITORIAL_PORTRAIT_PREVIEW_3 as string) ||
    "https://res.cloudinary.com/dcxib2abj/image/upload/v1758004452/beqeolrkvriry3cqkcck.png",
  ((import.meta as any).env?.VITE_EDITORIAL_PORTRAIT_PREVIEW_4 as string) ||
    "https://res.cloudinary.com/dcxib2abj/image/upload/v1758004452/jnhxqpxyzvjiymnapmgh.png",
];

const STUDIO_SHOT_PREVIEWS: string[] = [
  ((import.meta as any).env?.VITE_STUDIO_SHOT_PREVIEW_1 as string) ||
    "https://res.cloudinary.com/dcxib2abj/image/upload/v1758004707/qhqtaovt8lohtfryorko.png",
  ((import.meta as any).env?.VITE_STUDIO_SHOT_PREVIEW_2 as string) ||
    "https://res.cloudinary.com/dcxib2abj/image/upload/v1758004707/seddwhhuw5kqv3erkcww.png",
  ((import.meta as any).env?.VITE_STUDIO_SHOT_PREVIEW_3 as string) ||
    "https://res.cloudinary.com/dcxib2abj/image/upload/v1758004707/qgphosoh1trnbzehivw3.png",
  ((import.meta as any).env?.VITE_STUDIO_SHOT_PREVIEW_4 as string) ||
    "https://res.cloudinary.com/dcxib2abj/image/upload/v1758004707/synecolk4igzchxrjrlr.png",
];

const POSE_PACKAGES: PosePackage[] = [
  {
    id: "Candid Face to Face Event Speaker",
    name: "Candid Face to Face Event Speaker",
    previews: CANDID_PREVIEWS,
  },
  { id: "Standard Photoshoot", name: "Standard Photoshoot", previews: STANDARD_PREVIEWS },
  { id: "Smiling", name: "Smiling", previews: SMILING_PREVIEWS },
  { id: "Serious", name: "Serious", previews: SERIOUS_PREVIEWS },
  { id: "Contemporary Fashion", name: "Contemporary Fashion", previews: CONTEMPORARY_FASHION_PREVIEWS },
  { id: "Editorial Portrait", name: "Editorial Portrait", previews: EDITORIAL_PORTRAIT_PREVIEWS },
  { id: "Studio Shot", name: "Studio Shot", previews: STUDIO_SHOT_PREVIEWS },
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
  const [taskStatuses, setTaskStatuses] = useState<
    { taskId: string; status: string; message?: string }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
        if (typeof item === "string") {
          out.push(item);
        } else if (typeof item === "object" && item !== null) {
          // Check for secure_url property in objects
          if (item.secure_url && typeof item.secure_url === "string") {
            out.push(item.secure_url);
          } else {
            // Recursively extract from nested arrays/objects (e.g., [{ data: [{ secure_url }] }])
            out.push(...extractImageUrls(item));
          }
        } else {
          // Recursively extract from nested arrays/objects (e.g., [{ data: [{ secure_url }] }])
          out.push(...extractImageUrls(item));
        }
      }
      return out;
    }
    if (typeof data === "object") {
      // Check for secure_url property in objects
      if (data.secure_url && typeof data.secure_url === "string") {
        return [data.secure_url];
      }
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

  function extractTaskStatuses(data: any): { taskId: string; status: string; message?: string }[] {
    const out: { taskId: string; status: string; message?: string }[] = [];
    const walk = (node: any) => {
      if (!node) return;
      if (Array.isArray(node)) {
        for (const n of node) walk(n);
        return;
      }
      if (typeof node === "object") {
        const maybeData = (node as any).data ?? node;
        if (maybeData && typeof maybeData === "object") {
          const tid = maybeData.task_id;
          const st = maybeData.status;
          if (typeof tid === "string" && typeof st === "string") {
            const msg = (maybeData.error?.message as string | undefined) || (maybeData.logs?.[0] as string | undefined);
            out.push({ taskId: tid, status: st, message: msg });
          }
        }
        for (const v of Object.values(node)) walk(v);
      }
    };
    walk(data);
    return out;
  }

  const runGenerate = async () => {
    setIsGenerating(true);
    setTaskStatuses([]);

    let urls: string[] = [];
    let latestStatuses: { taskId: string; status: string; message?: string }[] = [];
    try {
      const DEFAULT_WEBHOOK_URL =
        "https://n8n.srv931715.hstgr.cloud/webhook-test/virtual-photoshoot";
      const WEBHOOK_URL =
        (typeof window !== "undefined" && localStorage.getItem("webhookUrlOverride")) ||
        ((import.meta as any).env?.VITE_WEBHOOK_URL as string | undefined) ||
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
            const statuses = extractTaskStatuses(data);
            if (statuses.length) {
              latestStatuses = statuses;
              setTaskStatuses(statuses);
            }
          } else {
            const text = await res.text();
            try {
              const parsed = JSON.parse(text);
              urls = extractImageUrls(parsed);
              const statuses = extractTaskStatuses(parsed);
              if (statuses.length) {
                latestStatuses = statuses;
                setTaskStatuses(statuses);
              }
            } catch {
              urls = [];
            }
          }
        } else {
          // Optional status polling if job ID is provided
          const statusUrl = localStorage.getItem("statusApiUrl") || "";
          const statusKey = localStorage.getItem("statusApiKey") || "";
          if (statusUrl) {
            try {
              const jobId = res.headers.get("x-job-id") || "";
              if (jobId) {
                const start = Date.now();
                while (Date.now() - start < 60000 && urls.length === 0) {
                  const statusRes = await fetch(statusUrl.replace("{jobId}", jobId), {
                    headers: statusKey ? { Authorization: `Bearer ${statusKey}` } : undefined,
                  });
                  if (statusRes.ok) {
                    const payload = await statusRes.json();
                    const out = extractImageUrls(payload);
                    if (out.length) {
                      urls = out;
                      break;
                    }
                    const statuses = extractTaskStatuses(payload);
                    if (statuses.length) {
                      latestStatuses = statuses;
                      setTaskStatuses(statuses);
                    }
                  }
                  await new Promise((r) => setTimeout(r, 1500));
                }
              }
            } catch {}
          }
        }
      }
    } catch (e) {
      urls = [];
    }

    if (!urls || urls.length === 0) {
      const hasFailed = latestStatuses.some(
        (s) => (s.status || "").toLowerCase() === "failed",
      );
      if (!hasFailed) {
        urls = Array.from({ length: 4 }).map(
          (_, i) =>
            `data:image/svg+xml;utf8,${encodeURIComponent(
              `<svg xmlns='http://www.w3.org/2000/svg' width='512' height='512'><rect width='100%' height='100%' fill='hsl(0,0%,92%)' /><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='hsl(0,0%,40%)' font-family='Inter' font-size='18'>Result ${
                i + 1
              }</text></svg>`,
            )}`,
        );
      }
    }

    const finalImgs = urls.slice(0, 4);
    setResults(finalImgs);
    if (selectedPackageId && finalImgs.length > 0) {
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
    <div className="space-y-8">
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
              "px-2 py-1 rounded bg-primary/10",
              step === 1 && "font-semibold text-foreground",
            )}
          >
            1. Choose Pose Package
          </span>
          <span>→</span>
          <span
            className={cn(
              "px-2 py-1 rounded bg-primary/10",
              step === 2 && "font-semibold text-foreground",
            )}
          >
            2. Upload Image
          </span>
          <span>→</span>
          <span
            className={cn(
              "px-2 py-1 rounded bg-primary/10",
              step === 3 && "font-semibold text-foreground",
            )}
          >
            3. Generate
          </span>
        </div>
        <div className="w-[88px]" />
      </header>

      {step === 1 && (
        <section aria-label="Choose Pose Package" className="space-y-4 rounded-2xl border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 p-4 md:p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {POSE_PACKAGES.map((p) => (
              <button
                key={p.id}
                onClick={() => setPreviewPackageId(p.id)}
                className={cn(
                  "group relative rounded-xl border bg-card p-2 text-left transition hover:border-primary/30 hover:shadow-sm",
                  selectedPackageId === p.id && "ring-2 ring-primary/40",
                )}
              >
                <div className="aspect-square rounded-lg bg-gradient-to-br from-muted to-background grid grid-cols-4 gap-1 p-1 overflow-hidden">
                  {/* First image - 4:3 aspect ratio, spans 3 columns */}
                  {(() => {
                    const src = p.previews?.[0];
                    return src ? (
                      <img
                        key={0}
                        src={src}
                        alt={`${p.name} preview 1`}
                        className="col-span-3 aspect-[4/3] w-full h-full object-contain rounded"
                      />
                    ) : (
                      <div key={0} className="col-span-3 aspect-[4/3] bg-muted rounded" />
                    );
                  })()}
                  
                  {/* Stacked 1:1 images - spans 1 column */}
                  <div className="col-span-1 flex flex-col gap-1">
                    {(p.previews?.slice(1, 4) ?? Array.from({ length: 3 })).map(
                      (_v, i) => {
                        const src = p.previews?.[i + 1];
                        return src ? (
                          <img
                            key={i + 1}
                            src={src}
                            alt={`${p.name} preview ${i + 2}`}
                            className="aspect-square w-full h-full object-contain rounded"
                          />
                        ) : (
                          <div key={i + 1} className="aspect-square bg-muted rounded" />
                        );
                      },
                    )}
                  </div>
                </div>
                <div className="mt-2 text-sm">{p.name}</div>
                {selectedPackageId === p.id && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1 shadow-sm">
                    <Check className="size-3" />
                  </div>
                )}
                <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-primary/30 pointer-events-none" />
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Hover to preview poses on desktop. Tap to expand on mobile.
          </p>

          <Dialog
            open={!!previewPackageId}
            onOpenChange={(o) => !o && setPreviewPackageId(null)}
          >
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {POSE_PACKAGES.find((pp) => pp.id === previewPackageId)
                    ?.name || "Pose Package"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-4 gap-2">
                {/* First image - 4:3 aspect ratio, spans 3 columns */}
                {(() => {
                  const pkg = POSE_PACKAGES.find((pp) => pp.id === previewPackageId);
                  const src = pkg?.previews?.[0];
                  return src ? (
                    <img
                      key={0}
                      src={src}
                      alt="Preview 1"
                      className="col-span-3 aspect-[4/3] w-full h-full object-contain rounded-md"
                    />
                  ) : (
                    <div key={0} className="col-span-3 aspect-[4/3] rounded-md bg-muted" />
                  );
                })()}
                
                {/* Stacked 1:1 images - spans 1 column */}
                <div className="col-span-1 flex flex-col gap-2">
                  {(POSE_PACKAGES.find((pp) => pp.id === previewPackageId)
                    ?.previews?.slice(1, 4) ?? Array.from({ length: 3 })).map(
                    (_v, i) => {
                      const pkg = POSE_PACKAGES.find(
                        (pp) => pp.id === previewPackageId,
                      );
                      const src = pkg?.previews?.[i + 1];
                      return src ? (
                        <img
                          key={i + 1}
                          src={src}
                          alt={`Preview ${i + 2}`}
                          className="aspect-square w-full h-full object-contain rounded-md"
                        />
                      ) : (
                        <div key={i + 1} className="aspect-square rounded-md bg-muted" />
                      );
                    },
                  )}
                </div>
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
          <div className="pt-2 flex justify-end">
            <Button onClick={() => setStep(2)} disabled={!selectedPackageId}>
              Next
            </Button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section aria-label="Upload Image" className="space-y-4 max-w-3xl mx-auto w-full rounded-2xl border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 p-4 md:p-6 shadow-md hover:shadow-lg transition-shadow">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className="relative border-2 border-dashed rounded-xl bg-card p-6 flex flex-col items-center justify-center text-center min-h-56 overflow-auto resize-y cursor-pointer"
          >
            {previewUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Uploaded preview"
                  className="absolute inset-0 w-full h-full object-contain"
                />
                <button
                  aria-label="Clear image"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setResults([]);
                    setAdvanceOnFile(false);
                    setStep(2);
                  }}
                  className="absolute right-2 top-2 inline-flex items-center justify-center rounded-md bg-background/80 hover:bg-background/90 border px-2 py-1 text-xs shadow-sm"
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
                ref={fileInputRef}
              />
              <span className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm hover:bg-primary/10 cursor-pointer">
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
        <section aria-label="Generate" className="space-y-6 rounded-2xl border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 p-4 md:p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-center gap-2">
            <Button
              onClick={runGenerate}
              disabled={isGenerating}
              className="h-12 px-6 bg-primary-accent hover:shadow-[0_0_0_3px_rgba(59,130,246,0.15)]"
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
          </div>

          {isGenerating && (
            <div className="mx-auto max-w-xl h-2 bg-muted rounded overflow-hidden">
              <div className="h-full w-1/3 bg-primary/60 animate-pulse" />
            </div>
          )}

          {taskStatuses.length > 0 && (() => {
            const failed = taskStatuses.find((t) => (t.status || "").toLowerCase() === "failed");
            const succeeded = taskStatuses.some((t) => (t.status || "").toLowerCase() === "succeeded");
            const processing = taskStatuses.some((t) => {
              const s = (t.status || "").toLowerCase();
              return s !== "failed" && s !== "succeeded";
            });
            const message = failed
              ? "Generation Failed. Check Backend."
              : succeeded && results.length > 0
              ? "Generation Completed."
              : processing
              ? "Generation In Progress..."
              : "Generation Status Updated.";
            const badgeClass = failed
              ? "bg-destructive/10 text-destructive"
              : succeeded && results.length > 0
              ? "bg-emerald-500/10 text-emerald-600"
              : "bg-primary/10 text-primary";
            const detail = (() => {
              const raw = (failed?.message || "").trim();
              if (!raw) return undefined;
              const lower = raw.toLowerCase();
              if (lower.includes("failed to do request")) {
                return "Request Failed. Please Try Again or Check Backend.";
              }
              // Basic sentence-case fallback
              return raw.charAt(0).toUpperCase() + raw.slice(1);
            })();
            return (
              <div className="mx-auto max-w-2xl rounded-lg border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 p-3 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{message}</div>
                    {detail && <div className="text-xs mt-1 text-destructive">{detail}</div>}
                  </div>
                  <span className={cn("px-2 py-0.5 rounded text-xs", badgeClass)}>
                    {failed ? "Failed" : succeeded && results.length > 0 ? "Succeeded" : "Processing"}
                  </span>
                </div>
              </div>
            );
          })()}

          {results.length > 0 && (() => {
            const hasFailed = taskStatuses.some(
              (s) => (s.status || "").toLowerCase() === "failed",
            );
            if (hasFailed) return null;
            return (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (results.length) {
                      const added = addAllToLibrary(results, { packageId: selectedPackageId ?? undefined });
                      if (added) {
                        toast({
                          title: "Added to Library",
                          description: `${results.length} image${results.length > 1 ? "s" : ""} saved`,
                        });
                      } else {
                        toast({
                          title: "Already Saved",
                          description: "These images are already in your library.",
                        });
                      }
                    }
                  }}
                >
                  Add All to Library
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {results.map((src, i) => (
                  <div
                    key={i}
                    className="rounded-xl border bg-card/90 backdrop-blur p-2 flex flex-col gap-2 shadow-sm"
                  >
                    <div className="aspect-square rounded-lg bg-muted overflow-hidden flex items-center justify-center">
                      {src ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={src}
                          alt={`Generated ${i + 1}`}
                          className="w-full h-full object-contain"
                          loading="lazy"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <Loader2 className="size-6 animate-spin text-primary" />
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
            );
          })()}

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
