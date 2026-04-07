export default function ProjectLoading() {
  return (
    <article className="max-w-5xl mx-auto px-6 py-16 animate-pulse">
      {/* Cover placeholder */}
      <div className="h-48 w-full rounded-2xl bg-[var(--border)] mb-10" />

      {/* Header skeleton */}
      <header className="mb-10">
        <div className="flex gap-2 mb-4">
          <div className="h-5 w-20 rounded-full bg-[var(--border)]" />
          <div className="h-5 w-16 rounded-full bg-[var(--border)]" />
          <div className="h-5 w-24 rounded-full bg-[var(--border)]" />
        </div>
        <div className="h-10 w-2/3 rounded-lg bg-[var(--border)] mb-3" />
        <div className="h-4 w-40 rounded bg-[var(--border)]" />
        <div className="flex gap-3 mt-5">
          <div className="h-8 w-28 rounded-lg bg-[var(--border)]" />
          <div className="h-8 w-28 rounded-lg bg-[var(--border)]" />
        </div>
      </header>

      {/* Content skeleton */}
      <div className="space-y-4">
        <div className="h-4 w-full rounded bg-[var(--border)]" />
        <div className="h-4 w-5/6 rounded bg-[var(--border)]" />
        <div className="h-4 w-full rounded bg-[var(--border)]" />
        <div className="h-8 w-1/2 rounded-lg bg-[var(--border)] mt-6" />
        <div className="h-4 w-full rounded bg-[var(--border)]" />
        <div className="h-4 w-4/5 rounded bg-[var(--border)]" />
        <div className="h-4 w-full rounded bg-[var(--border)]" />
      </div>
    </article>
  );
}
