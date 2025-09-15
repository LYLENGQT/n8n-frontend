import { Button } from "@/components/ui/button";
import { Download, Share2, Trash2 } from "lucide-react";

export default function Library() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-xl font-semibold mb-2">Library</h1>
      <p className="text-sm text-muted-foreground">Saved/generated images will appear here in date or package groups.</p>
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="group relative aspect-square rounded-lg border bg-muted overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 p-2 flex gap-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="sm" variant="secondary" aria-label="Download"><Download className="size-4" /></Button>
              <Button size="sm" variant="outline" aria-label="Share"><Share2 className="size-4" /></Button>
              <Button size="sm" variant="destructive" aria-label="Delete"><Trash2 className="size-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
