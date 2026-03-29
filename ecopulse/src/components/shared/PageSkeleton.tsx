export default function PageSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-4" role="status" aria-label="Loading">
      {/* Header skeleton */}
      <div className="flex justify-between items-start">
        <div>
          <div className="h-8 w-64 bg-surface-2 rounded-lg" />
          <div className="h-4 w-40 bg-surface-2 rounded-md mt-2" />
        </div>
        <div className="h-10 w-32 bg-surface-2 rounded-lg" />
      </div>

      {/* Stat cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="card p-4">
            <div className="h-3 w-20 bg-surface-2 rounded" />
            <div className="h-7 w-28 bg-surface-2 rounded mt-2" />
            <div className="flex justify-between items-end mt-3">
              <div className="h-3 w-16 bg-surface-2 rounded" />
              <div className="h-10 w-24 bg-surface-2 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Chart area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-4 h-64">
          <div className="h-4 w-32 bg-surface-2 rounded mb-4" />
          <div className="h-full bg-surface-2 rounded-xl" />
        </div>
        <div className="card p-4 h-64">
          <div className="h-4 w-32 bg-surface-2 rounded mb-4" />
          <div className="h-full bg-surface-2 rounded-xl" />
        </div>
      </div>

      <span className="sr-only">Loading content…</span>
    </div>
  );
}
