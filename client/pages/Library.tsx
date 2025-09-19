import { Button } from "@/components/ui/button";
import { Download, Maximize2, Search, Share2, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getLibrary, clearLibrary, removeLibraryItem, type LibraryItem, removeImagesFromLibrary } from "@/lib/library";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function Library() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [lightbox, setLightbox] = useState<{ open: boolean; src: string | null; index: number; flat: string[] }>(
    { open: false, src: null, index: 0, flat: [] },
  );

  useEffect(() => {
    setItems(getLibrary());
  }, []);

  const onDelete = (id: string) => {
    removeLibraryItem(id);
    setItems(getLibrary());
  };

  const flatImages = useMemo(() => items.flatMap((g) => g.images), [items]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((g) =>
      (g.packageId || "").toLowerCase().includes(q) ||
      new Date(g.createdAt).toLocaleDateString().toLowerCase().includes(q),
    );
  }, [items, query]);

  const toggleSelect = (src: string) =>
    setSelected((s) => ({ ...s, [src]: !s[src] }));

  const clearSelection = () => setSelected({});

  const selectedList = useMemo(
    () => Object.entries(selected).filter(([, v]) => v).map(([k]) => k),
    [selected],
  );

  const bulkDelete = () => {
    if (selectedList.length === 0) return;
    removeImagesFromLibrary(selectedList);
    setItems(getLibrary());
    clearSelection();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold tracking-tight">Library</h1>
          <div className="text-xs text-muted-foreground">{flatImages.length} images</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="size-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search package/date" className="pl-7 h-8 w-[200px]" />
          </div>
          {selectedList.length > 0 && (
            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary" onClick={bulkDelete}>Delete Selected ({selectedList.length})</Button>
              <Button size="sm" variant="outline" onClick={clearSelection}>Clear Selection</Button>
            </div>
          )}
        {items.length > 0 && (
          <Button
            variant="outline"
            onClick={() => {
              clearLibrary();
              setItems([]);
            }}
          >
            Clear All
          </Button>
        )}
        </div>
      </div>
      {items.length === 0 ? (
        <div className="text-center text-sm text-muted-foreground rounded-2xl border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 py-10">
          <div className="mx-auto mb-3 size-12 rounded-full bg-muted" />
          <p>No saved items yet. Use "Add All to Library" after generation or from History.</p>
          <div className="mt-3">
            <Button asChild>
              <a href="/app/generate">Go to Generate</a>
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map((group) => (
            <div key={group.id} className="rounded-2xl border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-md">
              <div className="flex items-center justify-between px-4 py-2 border-b">
                <div className="text-sm text-muted-foreground sticky -top-px bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
                  {new Date(group.createdAt).toLocaleString()}
                </div>
                <div className="flex items-center gap-2">
                  {group.packageId && (
                    <div className="text-sm">Package: <span className="font-medium">{group.packageId}</span></div>
                  )}
                  <Button size="sm" variant="destructive" onClick={() => onDelete(group.id)}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
              <div className="p-3 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                {group.images.map((src, i) => (
                  <div key={i} className="group relative aspect-square rounded-lg bg-muted overflow-hidden transition-transform duration-200 hover:scale-[1.02] cursor-zoom-in">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="saved" className="w-full h-full object-cover" loading="lazy" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 16vw" onClick={() => setLightbox({ open: true, src, index: i, flat: group.images })} />
                    <div className="absolute inset-x-0 bottom-0 p-2 flex gap-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="secondary" aria-label="Download"><Download className="size-4" /></Button>
                      <Button size="sm" variant="outline" aria-label="Share"><Share2 className="size-4" /></Button>
                      <Button size="sm" variant={selected[src] ? "secondary" : "outline"} onClick={() => toggleSelect(src)}>
                        {selected[src] ? "Selected" : "Select"}
                      </Button>
                    </div>
                    <button className="absolute right-2 top-2 inline-flex items-center justify-center rounded-md bg-background/80 hover:bg-background/90 border p-1 text-xs shadow-sm"
                      onClick={() => setLightbox({ open: true, src, index: i, flat: group.images })}
                      aria-label="Open"
                    >
                      <Maximize2 className="size-4" />
                    </button>
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
