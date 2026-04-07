"use client";

import { useEffect, useRef } from "react";

const SAMPLE_GAP = 4;       // sample every N pixels — lower = denser particles
const PARTICLE_SIZE = 3;    // px per particle square
const STABLE_MS = 1800;     // hold image fully formed
const DISSOLVE_MS = 2400;   // dissolve outward
const VOID_MS = 300;        // brief black pause
const REFORM_MS = 2000;     // particles fly back

interface Particle {
  ox: number; oy: number;   // origin position
  dx: number; dy: number;   // drift destination
  r: number; g: number; b: number;
}

type Phase = "stable" | "dissolve" | "void" | "reform";

function easeIn(t: number) { return t * t * t; }
function easeOut(t: number) { return 1 - Math.pow(1 - t, 3); }

export function HeroParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let animId: number;
    let phase: Phase = "stable";
    let phaseStart = performance.now();

    const img = new Image();
    img.src = "/hero-bg.jpg";

    const buildParticles = () => {
      particles = [];
      const oc = document.createElement("canvas");
      oc.width = canvas.width;
      oc.height = canvas.height;
      const oc2 = oc.getContext("2d")!;

      // object-fit: cover
      const scale = Math.max(
        canvas.width / img.naturalWidth,
        canvas.height / img.naturalHeight
      );
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      oc2.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);

      const { data } = oc2.getImageData(0, 0, canvas.width, canvas.height);

      for (let y = 0; y < canvas.height; y += SAMPLE_GAP) {
        for (let x = 0; x < canvas.width; x += SAMPLE_GAP) {
          const i = (y * canvas.width + x) * 4;
          if (data[i + 3] < 20) continue;
          // drift: sand blown right + slightly down, randomised spread
          const angle = (Math.random() * 0.8 - 0.4); // mostly rightward
          const dist = 60 + Math.random() * 280;
          particles.push({
            ox: x, oy: y,
            dx: x + Math.cos(angle) * dist,
            dy: y + Math.sin(angle) * dist + (Math.random() - 0.2) * 80,
            r: data[i], g: data[i + 1], b: data[i + 2],
          });
        }
      }
    };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      if (img.complete && img.naturalWidth) buildParticles();
    };

    const draw = (ts: number) => {
      const elapsed = ts - phaseStart;

      // Advance phase
      if (phase === "stable" && elapsed > STABLE_MS) {
        phase = "dissolve"; phaseStart = ts;
      } else if (phase === "dissolve" && elapsed > DISSOLVE_MS) {
        phase = "void"; phaseStart = ts;
      } else if (phase === "void" && elapsed > VOID_MS) {
        phase = "reform"; phaseStart = ts;
      } else if (phase === "reform" && elapsed > REFORM_MS) {
        phase = "stable"; phaseStart = ts;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        let px: number, py: number, alpha: number;

        if (phase === "stable") {
          px = p.ox; py = p.oy; alpha = 1;
        } else if (phase === "dissolve") {
          const t = easeIn(Math.min(elapsed / DISSOLVE_MS, 1));
          px = p.ox + (p.dx - p.ox) * t;
          py = p.oy + (p.dy - p.oy) * t;
          alpha = 1 - t;
        } else if (phase === "void") {
          px = p.dx; py = p.dy; alpha = 0;
        } else {
          // reform
          const t = easeOut(Math.min(elapsed / REFORM_MS, 1));
          px = p.dx + (p.ox - p.dx) * t;
          py = p.dy + (p.oy - p.dy) * t;
          alpha = t;
        }

        ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${alpha})`;
        ctx.fillRect(px, py, PARTICLE_SIZE, PARTICLE_SIZE);
      }

      animId = requestAnimationFrame(draw);
    };

    img.onload = () => {
      resize();
      animId = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  );
}
