"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { List } from "lucide-react";

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

/** Scroll-based active heading detection — much more reliable than IntersectionObserver */
function useActiveHeading(items: TocItem[]) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (items.length === 0) return;

    const OFFSET = 100; // px from top to consider "active"

    function onScroll() {
      // Find the last heading whose top is above the offset line
      let current = "";
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= OFFSET) {
          current = item.id;
        } else {
          break; // headings are in document order, no need to check further
        }
      }

      // If we're at the very top (before any heading), highlight the first item
      if (!current && items.length > 0) {
        current = items[0].id;
      }

      setActiveId(current);
    }

    // Run once immediately
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  return activeId;
}

/** Track article reading progress (0–100) */
function useReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        setProgress(100);
        return;
      }
      setProgress(Math.min(100, Math.round((window.scrollY / docHeight) * 100)));
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return progress;
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

  // Auto-scroll the TOC sidebar to keep the active item visible
  useEffect(() => {
    if (!autoScroll || !activeRef.current || !navRef.current) return;
    const nav = navRef.current;
    const active = activeRef.current;
    const navRect = nav.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();

    // If active item is outside visible area of the nav, scroll it into view
    if (activeRect.top < navRect.top || activeRect.bottom > navRect.bottom) {
      active.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [activeId, autoScroll]);

  function handleClick(e: React.MouseEvent, id: string) {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
      window.history.pushState(null, "", `#${id}`);
    }
    onAfterClick?.();
  }

  return (
    <nav ref={navRef} className="border-l border-[var(--border)] max-h-[calc(100vh-14rem)] overflow-y-auto scrollbar-thin">
      {items.map((item) => {
        const isActive = activeId === item.id;
        return (
          <a
            key={item.id}
            ref={isActive ? activeRef : undefined}
            href={`#${item.id}`}
            onClick={(e) => handleClick(e, item.id)}
            className={cn(
              "block py-1.5 pl-3 text-sm border-l -ml-px transition-all duration-200",
              item.level === 3 && "pl-6",
              isActive
                ? "text-accent border-accent font-medium"
                : "text-[var(--text-secondary)] border-transparent hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)]"
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
      {/* Reading progress */}
      <div className="mb-3 flex items-center gap-2">
        <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
          {tocLabel}
        </p>
        <span className="text-[10px] tabular-nums text-accent/70">{progress}%</span>
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
