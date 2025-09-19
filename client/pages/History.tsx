import { useEffect, useMemo, useState } from "react";
import { GenerationRecord, getHistory, clearHistory, removeRecord } from "@/lib/history";
import { addAllToLibrary } from "@/lib/library";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Maximize2, Search, Trash2 } from "lucide-react";

export default function History() {
  const [items, setItems] = useState<GenerationRecord[]>([]);
  const [query, setQuery] = useState("");
  const [lightbox, setLightbox] = useState<{ open: boolean; src: string | null; index: number; flat: string[] }>(
    { open: false, src: null, index: 0, flat: [] },
  );
  useEffect(() => {
    setItems(getHistory());
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((r) =>
      r.packageId.toLowerCase().includes(q) ||
      new Date(r.createdAt).toLocaleDateString().toLowerCase().includes(q),
    );
  }, [items, query]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold tracking-tight">History</h1>
          <div className="text-xs text-muted-foreground">{items.length} sessions</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="size-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search package/date" className="pl-7 h-8 w-[200px]" />
          </div>
        {items.length > 0 && (
          <Button
            variant="outline"
            onClick={() => {
              clearHistory();
              setItems([]);
            }}
          >
            Clear All
          </Button>
        )}
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="text-center text-sm text-muted-foreground rounded-2xl border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 py-10">
          <div className="mx-auto mb-3 size-12 rounded-full bg-muted" />
          <p>No history yet. Generate some images to see them here.</p>
          <div className="mt-3">
            <Button asChild>
              <a href="/app/generate">Go to Generate</a>
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map((rec) => (
            <div key={rec.id} className="rounded-2xl border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-md">
              <div className="flex items-center justify-between px-4 py-2 border-b">
                <div className="text-sm text-muted-foreground">{new Date(rec.createdAt).toLocaleString()}</div>
                <div className="flex items-center gap-2">
                  <div className="text-sm">Package: <span className="font-medium">{rec.packageId}</span></div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const added = addAllToLibrary(rec.images, { sourceRecordId: rec.id, packageId: rec.packageId });
                      if (added) {
                        toast({
                          title: "Added to Library",
                          description: `${rec.images.length} image${rec.images.length > 1 ? "s" : ""} saved`,
                        });
                      } else {
                        toast({
                          title: "Already Saved",
                          description: "These images are already in your library.",
                        });
                      }
                    }}
                  >
                    Add All to Library
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      removeRecord(rec.id);
                      setItems(getHistory());
                    }}
                    aria-label="Delete generation"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
              <div className="p-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {rec.images.map((src, i) => (
                  <div key={i} className="aspect-square rounded-lg bg-muted overflow-hidden transition-transform duration-200 hover:scale-[1.02] cursor-zoom-in">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="history" className="w-full h-full object-contain" loading="lazy" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" onClick={() => setLightbox({ open: true, src, index: i, flat: rec.images })} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={lightbox.open} onOpenChange={(o) => setLightbox((s) => ({ ...s, open: o }))}>
        <DialogContent className="sm:max-w-3xl">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {lightbox.src && (
              <img src={lightbox.src} alt="preview" className="w-full h-auto object-contain" />
            )}
            <div className="absolute inset-x-0 bottom-0 p-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {lightbox.index + 1} / {lightbox.flat.length}
              </span>
              <div className="space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setLightbox((s) => {
                      const next = (s.index - 1 + s.flat.length) % s.flat.length;
                      return { ...s, index: next, src: s.flat[next] };
                    })
                  }
                >
                  Prev
                </Button>
                <Button
                  size="sm"
                  onClick={() =>
                    setLightbox((s) => {
                      const next = (s.index + 1) % s.flat.length;
                      return { ...s, index: next, src: s.flat[next] };
                    })
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
