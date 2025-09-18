import { useEffect, useState } from "react";
import { GenerationRecord, getHistory, clearHistory } from "@/lib/history";
import { Button } from "@/components/ui/button";

export default function History() {
  const [items, setItems] = useState<GenerationRecord[]>([]);
  useEffect(() => {
    setItems(getHistory());
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">History</h1>
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
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No history yet. Generate some images to see them here.</p>
      ) : (
        <div className="space-y-6">
          {items.map((rec) => (
            <div key={rec.id} className="rounded-xl border bg-card/90 backdrop-blur">
              <div className="flex items-center justify-between px-4 py-2 border-b">
                <div className="text-sm text-muted-foreground">{new Date(rec.createdAt).toLocaleString()}</div>
                <div className="text-sm">Package: <span className="font-medium">{rec.packageId}</span></div>
              </div>
              <div className="p-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {rec.images.map((src, i) => (
                  <div key={i} className="aspect-square rounded-lg bg-muted overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="history" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
