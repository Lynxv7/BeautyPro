export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Page header skeleton */}
      <div className="space-y-1">
        <div className="h-7 w-40 rounded-lg bg-muted" />
        <div className="h-4 w-56 rounded-md bg-muted" />
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-6 space-y-3">
            <div className="flex justify-between">
              <div className="h-4 w-20 rounded bg-muted" />
              <div className="h-4 w-4 rounded bg-muted" />
            </div>
            <div className="h-8 w-16 rounded bg-muted" />
            <div className="h-3 w-28 rounded bg-muted" />
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Chart skeleton */}
          <div className="rounded-2xl border bg-card p-6 space-y-4">
            <div className="h-5 w-28 rounded bg-muted" />
            <div className="h-4 w-64 rounded bg-muted" />
            <div className="h-64 w-full rounded-lg bg-muted" />
          </div>
          {/* Table skeleton */}
          <div className="rounded-2xl border bg-card p-6 space-y-4">
            <div className="h-5 w-48 rounded bg-muted" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="h-4 w-16 rounded bg-muted" />
                <div className="h-4 w-32 rounded bg-muted" />
                <div className="h-4 w-24 rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>

        {/* Top services skeleton */}
        <div className="rounded-2xl border bg-card p-6 space-y-4">
          <div className="h-5 w-32 rounded bg-muted" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between">
                <div className="h-4 w-28 rounded bg-muted" />
                <div className="h-4 w-6 rounded bg-muted" />
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
