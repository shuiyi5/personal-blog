export default function ArticleLoading() {
  return (
    <article className="max-w-5xl mx-auto px-6 py-16 animate-pulse">
      {/* Header skeleton */}
      <header className="mb-10">
        <div className="flex gap-3 mb-4">
          <div className="h-4 w-24 rounded bg-[var(--border)]" />
          <div className="h-4 w-16 rounded bg-[var(--border)]" />
          <div className="h-4 w-20 rounded bg-[var(--border)]" />
        </div>
        <div className="h-10 w-3/4 rounded-lg bg-[var(--border)] mb-3" />
        <div className="h-4 w-28 rounded bg-[var(--border)]" />
      </header>

      {/* Content skeleton */}
      <div className="flex gap-10">
        <div className="flex-1 space-y-4">
          <div className="h-4 w-full rounded bg-[var(--border)]" />
          <div className="h-4 w-5/6 rounded bg-[var(--border)]" />
          <div className="h-4 w-full rounded bg-[var(--border)]" />
          <div className="h-8 w-1/2 rounded-lg bg-[var(--border)] mt-6" />
          <div className="h-4 w-full rounded bg-[var(--border)]" />
          <div className="h-4 w-4/5 rounded bg-[var(--border)]" />
          <div className="h-4 w-full rounded bg-[var(--border)]" />
          <div className="h-32 w-full rounded-lg bg-[var(--border)] mt-4" />
          <div className="h-4 w-3/4 rounded bg-[var(--border)]" />
          <div className="h-4 w-full rounded bg-[var(--border)]" />
        </div>
        {/* TOC skeleton */}
        <div className="hidden lg:block w-56 shrink-0 space-y-2">
          <div className="h-3 w-12 rounded bg-[var(--border)] mb-3" />
          <div className="h-3 w-36 rounded bg-[var(--border)]" />
          <div className="h-3 w-28 rounded bg-[var(--border)]" />
          <div className="h-3 w-32 rounded bg-[var(--border)]" />
          <div className="h-3 w-24 rounded bg-[var(--border)]" />
        </div>
      </div>
    </article>
  );
}
