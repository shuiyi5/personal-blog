export default function BlogLoading() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 animate-pulse">
      {/* Title skeleton */}
      <div className="h-8 w-24 rounded-lg bg-[var(--border)] mb-8" />
      {/* Filter bar skeleton */}
      <div className="flex gap-2 mb-8">
        {[48, 96, 80, 64].map((w, i) => (
          <div
            key={i}
            className="h-8 rounded-md bg-[var(--border)]"
            style={{ width: w }}
          />
        ))}
      </div>
      {/* Post list skeleton */}
      <div className="space-y-0">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 py-4 border-b border-[var(--border)]"
          >
            <div className="h-4 w-28 rounded bg-[var(--border)]" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-3/4 rounded bg-[var(--border)]" />
              <div className="h-3 w-1/2 rounded bg-[var(--border)]" />
            </div>
            <div className="h-5 w-20 rounded bg-[var(--border)]" />
          </div>
        ))}
      </div>
    </div>
  );
}
