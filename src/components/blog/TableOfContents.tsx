"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { List } from "lucide-react";

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

/**
 * Find a heading element in the DOM by its id.
 * Falls back to text-content matching if getElementById fails.
 */
function findHeadingElement(item: TocItem): HTMLElement | null {
  // Primary: exact id match
  const byId = document.getElementById(item.id);
  if (byId) return byId;

  // Fallback: find heading by text content
  const headings = document.querySelectorAll("h1, h2, h3");
  for (const h of headings) {
    if (h.textContent?.trim() === item.text.trim()) {
      return h as HTMLElement;
    }
  }
  return null;
}

function useActiveHeading(items: TocItem[]) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (items.length === 0) return;

    function onScroll() {
      const OFFSET = 120;
      let currentIdx = 0;

      for (let i = 0; i < items.length; i++) {
        const el = findHeadingElement(items[i]);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= OFFSET) {
          currentIdx = i;
        }
      }

      // Bottom of page → last item
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 50) {
        currentIdx = items.length - 1;
      }

      setActiveIndex(currentIdx);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  return activeIndex;
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

interface TocNavProps {
  items: TocItem[];
  activeIndex: number;
  onAfterClick?: () => void;
  syncScroll?: boolean;
}

function TocNav({ items, activeIndex, onAfterClick, syncScroll }: TocNavProps) {
  const navRef = useRef<HTMLElement>(null);

  // Sync-scroll: keep active item centered in the TOC nav
  useEffect(() => {
    if (!syncScroll || !navRef.current) return;
    const nav = navRef.current;
    const children = nav.children;
    if (activeIndex < 0 || activeIndex >= children.length) return;

    const activeEl = children[activeIndex] as HTMLElement;
    const navHeight = nav.clientHeight;
    const targetScrollTop = activeEl.offsetTop - navHeight / 2 + activeEl.clientHeight / 2;

    nav.scrollTo({ top: Math.max(0, targetScrollTop), behavior: "smooth" });
  }, [activeIndex, syncScroll]);

  function handleClick(item: TocItem) {
    const el = findHeadingElement(item);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      // Update URL hash
      if (item.id) {
        window.history.pushState(null, "", `#${item.id}`);
      }
    }
    onAfterClick?.();
  }

  return (
    <nav
      ref={navRef}
      className="border-l border-[var(--border)] max-h-[calc(100vh-14rem)] overflow-y-auto"
      style={{ scrollBehavior: "smooth" }}
    >
      {items.map((item, i) => {
        const isActive = i === activeIndex;
        return (
          <button
            key={`${item.id}-${i}`}
            type="button"
            onClick={() => handleClick(item)}
            className={cn(
              "block w-full text-left py-1.5 text-sm border-l-2 -ml-px cursor-pointer transition-all duration-200",
              item.level === 2 && "pl-3",
              item.level === 3 && "pl-6",
              isActive
                ? "border-accent text-accent font-semibold bg-accent/5"
                : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-accent/40"
            )}
          >
            {item.text}
          </button>
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
  const activeIndex = useActiveHeading(items);
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
      <TocNav items={items} activeIndex={activeIndex} syncScroll />
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
  const activeIndex = useActiveHeading(items);
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
          <TocNav items={items} activeIndex={activeIndex} onAfterClick={close} />
        </div>
      )}
    </div>
  );
}
