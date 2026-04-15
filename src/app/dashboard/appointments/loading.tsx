export default function AppointmentsLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-7 w-44 rounded-lg bg-muted" />
        <div className="h-9 w-40 rounded-full bg-muted" />
      </div>
      <div className="rounded-lg border bg-card">
        <div className="border-b px-4 py-3 flex gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-4 w-20 rounded bg-muted" />
          ))}
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex gap-6 px-4 py-3 border-b last:border-0">
            <div className="h-4 w-32 rounded bg-muted" />
            <div className="h-4 w-24 rounded bg-muted" />
            <div className="h-4 w-20 rounded bg-muted" />
            <div className="h-4 w-16 rounded bg-muted" />
            <div className="h-4 w-16 rounded bg-muted" />
            <div className="h-4 w-16 rounded bg-muted" />
            <div className="h-5 w-20 rounded-full bg-muted" />
            <div className="h-4 w-24 rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
