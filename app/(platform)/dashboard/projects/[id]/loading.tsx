export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse p-8">
      <div className="h-48 w-full rounded-[2.5rem] bg-muted" />
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 rounded-2xl bg-muted" />
        ))}
      </div>
    </div>
  );
}
