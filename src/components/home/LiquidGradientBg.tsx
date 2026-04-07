"use client";

import { useEffect, useRef } from "react";

export function LiquidGradientBg() {
  const grainRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = grainRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let animId: number;
    let frame = 0;

    const resize = () => {
      // Render at 40% resolution and scale up for performance
      canvas.width = Math.floor(canvas.offsetWidth * 0.4);
      canvas.height = Math.floor(canvas.offsetHeight * 0.4);
    };

    const render = () => {
      frame++;
      // Refresh grain ~20fps (every 3 animation frames)
      if (frame % 3 === 0) {
        const { width, height } = canvas;
        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const v = (Math.random() * 255) | 0;
          data[i] = data[i + 1] = data[i + 2] = v;
          data[i + 3] = (Math.random() * 28) | 0;
        }
        ctx.putImageData(imageData, 0, 0);
      }
      animId = requestAnimationFrame(render);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Deep wine base */}
      <div className="absolute inset-0" style={{ background: "#160812" }} />

      {/* Orb 1 — sakura coral, top-right */}
      <div className="liquid-orb orb-sk-1" />
      {/* Orb 2 — deep rose, bottom-left */}
      <div className="liquid-orb orb-sk-2" />
      {/* Orb 3 — lavender-pink, center */}
      <div className="liquid-orb orb-sk-3" />
      {/* Orb 4 — pale blush, top-left */}
      <div className="liquid-orb orb-sk-4" />

      {/* Animated film grain overlay */}
      <canvas
        ref={grainRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ imageRendering: "pixelated", mixBlendMode: "overlay", opacity: 0.55 }}
        aria-hidden
      />
    </div>
  );
}
