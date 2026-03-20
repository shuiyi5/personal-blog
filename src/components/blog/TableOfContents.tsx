"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { List } from "lucide-react";

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

function useActiveHeading(items: TocItem[]) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (items.length === 0) return;

    function onScroll() {
      const OFFSET = 120;
      let current = items[0]?.id ?? "";

      // Walk all headings, pick the last one whose top is above the offset
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= OFFSET) {
          current = item.id;
        }
      }

      // If scrolled to bottom, activate last item
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 50) {
        current = items[items.length - 1].id;
      }

      setActiveId(current);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  return activeId;
}

function useReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return setProgress(100);
      setProgress(Math.min(100, Math.round((window.scrollY / docHeight) * 100)));
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return progress;
}

function scrollToHeading(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

interface TocNavProps {
  items: TocItem[];
  activeId: string;
  onAfterClick?: () => void;
  autoScroll?: boolean;
}

function TocNav({ items, activeId, onAfterClick, autoScroll }: TocNavProps) {
  const navRef = useRef<HTMLElement>(null);
  const activeRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!autoScroll || !activeRef.current || !navRef.current) return;
    const nav = navRef.current;
    const active = activeRef.current;
    const navRect = nav.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    if (activeRect.top < navRect.top || activeRect.bottom > navRect.bottom) {
      active.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [activeId, autoScroll]);

  return (
    <nav
      ref={navRef}
      className="border-l border-[var(--border)] max-h-[calc(100vh-14rem)] overflow-y-auto"
    >
      {items.map((item) => {
        const isActive = activeId === item.id;
        return (
          <a
            key={item.id}
            ref={isActive ? activeRef : undefined}
            href={`#${item.id}`}
            onClick={(e) => {
              e.preventDefault();
              scrollToHeading(item.id);
              window.history.pushState(null, "", `#${item.id}`);
              onAfterClick?.();
            }}
            className={cn(
              "block py-1.5 text-sm border-l-2 -ml-px cursor-pointer transition-all duration-200",
              item.level === 2 && "pl-3",
              item.level === 3 && "pl-6",
              isActive
                ? "border-accent text-accent font-semibold bg-accent/5"
                : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-accent/40"
            )}
          >
            {item.text}
          </a>
        );
      })}
    </nav>
  );
}

export function DesktopTOC({
  items,
  tocLabel,
}: {
  items: TocItem[];
  tocLabel: string;
}) {
  const activeId = useActiveHeading(items);
  const progress = useReadingProgress();

  if (items.length === 0) return null;

  return (
    <aside className="hidden lg:block sticky top-24 w-56 shrink-0 self-start">
      <div className="mb-3 flex items-center gap-2">
        <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
          {tocLabel}
        </p>
        <span className="text-[10px] tabular-nums text-accent/70">
          {progress}%
        </span>
      </div>
      <div className="h-0.5 rounded-full bg-[var(--border)] mb-3 overflow-hidden">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>
      <TocNav items={items} activeId={activeId} autoScroll />
    </aside>
  );
}

export function MobileTOC({
  items,
  tocLabel,
}: {
  items: TocItem[];
  tocLabel: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const activeId = useActiveHeading(items);
  const close = useCallback(() => setIsOpen(false), []);

  if (items.length === 0) return null;

  return (
    <div className="lg:hidden mb-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
      >
        <List size={16} />
        {tocLabel}
      </button>
      {isOpen && (
        <div className="mt-3">
          <TocNav items={items} activeId={activeId} onAfterClick={close} />
        </div>
      )}
    </div>
  );
}
