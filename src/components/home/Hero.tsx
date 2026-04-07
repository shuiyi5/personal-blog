import Link from "next/link";
import { socialLinks } from "@/lib/constants";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { LiquidGradientBg } from "./LiquidGradientBg";
import { HeroEntrance } from "./HeroEntrance";

interface HeroProps {
  dict: Dictionary;
}

function SvgGithub({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function SvgLinkedin({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function SvgX({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function SvgMail({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  );
}

const socials = [
  { href: socialLinks.github, Icon: SvgGithub, label: "GitHub" },
  { href: socialLinks.linkedin, Icon: SvgLinkedin, label: "LinkedIn" },
  { href: socialLinks.twitter, Icon: SvgX, label: "X" },
  { href: socialLinks.email, Icon: SvgMail, label: "Email" },
];

export function Hero({ dict }: HeroProps) {
  const name = dict.home.greeting.replace(" 👋", "").replace("Hi, I'm ", "").replace("你好，我是", "");

  return (
    <section className="relative w-full min-h-screen overflow-hidden -mt-16 flex items-center justify-center">
      {/* Liquid gradient background */}
      <LiquidGradientBg />

      {/* Bottom fade to page background */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-(--bg) to-transparent z-10" />

      {/* Centered content */}
      <div className="relative z-20 text-center px-6 pt-16 pb-24">

        {/* Status badge */}
        <HeroEntrance delay={100}>
          <div className="inline-flex items-center gap-2 mb-8 px-3 py-1.5 rounded-full text-xs font-medium border border-white/12 bg-white/6 backdrop-blur-sm text-white/55">
            <span className="w-1.5 h-1.5 rounded-full dot-pulse dot-sakura" />
            AI Product Manager &amp; Builder
          </div>
        </HeroEntrance>

        {/* Headline */}
        <HeroEntrance delay={250}>
          <h1 className="hero-headline text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight text-white mb-4 leading-[1.02]">
            {name}
            <br />
            <span className="hero-gradient-text">AI 产品探索者</span>
          </h1>
        </HeroEntrance>

        {/* Tagline */}
        <HeroEntrance delay={400}>
          <p className="text-base text-white/45 max-w-sm mx-auto leading-relaxed mb-10 font-light">
            {dict.home.tagline}
          </p>
        </HeroEntrance>

        {/* CTA buttons */}
        <HeroEntrance delay={550}>
          <div className="flex items-center justify-center gap-3 mb-10">
            <Link
              href="#posts"
              className="hero-btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-all"
            >
              阅读文章
              <span className="transition-transform">→</span>
            </Link>
            <Link
              href="#projects"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white/60 border border-white/12 hover:border-[#FFB7C5]/40 hover:text-white/85 transition-all duration-300 backdrop-blur-sm"
            >
              查看项目
            </Link>
          </div>
        </HeroEntrance>

        {/* Social icons */}
        <HeroEntrance delay={700}>
          <div className="flex items-center justify-center gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-8 h-8 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-white/35 hover:text-[#FFB7C5] hover:border-[#FFB7C5]/30 hover:bg-[#FFB7C5]/8 transition-all duration-300"
              >
                <s.Icon size={14} />
              </a>
            ))}
          </div>
        </HeroEntrance>
      </div>
    </section>
  );
}
