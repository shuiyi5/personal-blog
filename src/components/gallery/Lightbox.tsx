"use client";

import { useEffect } from "react";
import { X, ImageIcon, Copy, Check } from "lucide-react";
import Image from "next/image";
import type { GalleryItem } from "@/lib/data/types";
import { useState } from "react";

interface LightboxProps {
  item: GalleryItem;
  onClose: () => void;
}

export function Lightbox({ item, onClose }: LightboxProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const fullSrc = item.mediaUrl || item.cover || "";

  function copyDescription() {
    navigator.clipboard.writeText(item.description);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 md:p-8"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors z-10"
        aria-label="Close"
      >
        <X size={22} />
      </button>

      {/* Main container: image left, info right */}
      <div
        className="flex flex-col lg:flex-row w-full max-w-6xl max-h-[90vh] rounded-2xl overflow-hidden glass"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Image */}
        <div className="relative flex-1 min-h-[300px] lg:min-h-0 bg-black/40 flex items-center justify-center">
          {fullSrc ? (
            <Image
              src={fullSrc}
              alt={item.name}
              width={1200}
              height={800}
              className="w-full h-full object-contain"
              priority
            />
          ) : (
            <ImageIcon size={48} className="text-white/20" />
          )}
        </div>

        {/* Right: Info panel */}
        <div className="w-full lg:w-[340px] shrink-0 p-6 overflow-y-auto bg-[var(--bg)]/90 backdrop-blur-md border-t lg:border-t-0 lg:border-l border-[var(--glass-border)]">
          <h2 className="text-xl font-bold mb-3">{item.name}</h2>

          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Thumbnail preview row */}
          {item.cover && item.mediaUrl && item.cover !== item.mediaUrl && (
            <div className="mb-4">
              <p className="text-xs text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
                {item.language === "zh" ? "缩略图" : "Thumbnail"}
              </p>
              <div className="flex gap-2">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-[var(--glass-border)]">
                  <Image
                    src={item.cover}
                    alt="Thumbnail"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          {item.description && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">
                  {item.language === "zh" ? "描述" : "Description"}
                </p>
                <button
                  onClick={copyDescription}
                  className="flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-accent transition-colors"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--glass-border)] text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
                {item.description}
              </div>
            </div>
          )}

          {/* Type badge */}
          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
            <span className="px-2 py-0.5 rounded-full bg-accent/5 border border-accent/10">
              {item.type}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
