export default function Library() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-xl font-semibold mb-2">Library</h1>
      <p className="text-sm text-muted-foreground">Saved/generated images will appear here in date or package groups.</p>
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-lg border bg-muted" />
        ))}
      </div>
    </div>
  );
}
