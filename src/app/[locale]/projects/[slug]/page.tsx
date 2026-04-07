import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Github, ExternalLink, ArrowLeft } from "lucide-react";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isValidLocale } from "@/lib/utils";
import { siteConfig } from "@/lib/constants";
import { getProjectBySlug, getAllProjectSlugs } from "@/lib/data/projects";
import { RichContent } from "@/components/blog/content/RichContent";
import type { Locale } from "@/lib/data/types";

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map(({ slug, locale }) => ({ locale, slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) return {};

  const project = await getProjectBySlug(slug, locale as Locale);
  if (!project) return {};

  return {
    title: project.name,
    description: project.description,
    alternates: {
      languages: {
        zh: `${siteConfig.url}/zh/projects/${slug}`,
        en: `${siteConfig.url}/en/projects/${slug}`,
      },
    },
    openGraph: {
      title: project.name,
      description: project.description,
      url: `${siteConfig.url}/${locale}/projects/${slug}`,
      type: "website",
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const project = await getProjectBySlug(slug, typedLocale);
  if (!project) notFound();

  const dict = await getDictionary(typedLocale);
  const otherLocale = typedLocale === "zh" ? "en" : "zh";

  // Check if translation exists in the other locale
  const otherProject = await getProjectBySlug(slug, otherLocale);
  const hasOtherLang = otherProject !== null;

  return (
    <article className="max-w-5xl mx-auto px-6 py-16">
      {/* Back link */}
      <Link
        href={`/${typedLocale}/projects`}
        className="inline-flex items-center gap-1.5 text-sm font-mono text-(--text-secondary) hover:text-(--text-primary) transition-colors mb-10 group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        {dict.projects.title}
      </Link>

      {/* Cover — image or gradient placeholder */}
      {project.cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.cover}
          alt={project.name}
          className="w-full h-56 object-cover rounded-2xl border border-(--border) mb-10"
        />
      ) : (
        <div className="w-full h-48 rounded-2xl border border-(--border) bg-linear-to-br from-accent/10 via-[#c8a96e]/6 to-[#7a9e8e]/5 flex items-center justify-center mb-10">
          <span className="text-6xl font-bold gradient-text opacity-15 section-title-serif">
            {project.name.charAt(0)}
          </span>
        </div>
      )}

      {/* Header */}
      <header className="mb-10">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-(--bg-secondary) text-(--text-secondary) border border-(--border)"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="section-title-serif text-3xl md:text-4xl tracking-tight text-(--text-primary) leading-tight mb-3">
          {project.name}
        </h1>

        {/* Role */}
        <p className="text-sm text-(--text-secondary) mb-5">
          <span className="text-accent/70 font-medium">{dict.projects.role}:</span>{" "}
          {project.role}
        </p>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-(--border) bg-(--bg-secondary) text-(--text-primary) hover:border-accent/40 hover:text-accent transition-all duration-200"
            >
              <Github size={15} />
              {dict.projects.sourceCode}
            </a>
          )}
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-accent text-white hover:bg-accent-dark transition-all duration-200"
            >
              <ExternalLink size={15} />
              {dict.projects.visitSite}
            </a>
          )}
          {hasOtherLang ? (
            <Link
              href={`/${otherLocale}/projects/${slug}`}
              className="text-sm text-accent hover:text-accent-light transition-colors ml-1"
            >
              {dict.projects.readInOther}
            </Link>
          ) : (
            <span className="text-sm text-(--text-secondary) ml-1">
              {dict.projects.noTranslation}
            </span>
          )}
        </div>
      </header>

      {/* Divider */}
      <hr className="section-divider mb-10" />

      {/* Body content */}
      <div className="prose-content">
        {project.content.length > 0 ? (
          <RichContent blocks={project.content} />
        ) : (
          <p className="text-(--text-secondary) text-sm">
            {typedLocale === "zh" ? "详情内容暂未填写。" : "No content yet."}
          </p>
        )}
      </div>
    </article>
  );
}
