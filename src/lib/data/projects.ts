import type { Project, Locale } from "./types";
import { isNotionConfigured } from "@/lib/notion/client";
import { mockProjects } from "./mock/projects";

function getMockProjects(locale: Locale): Project[] {
  return mockProjects
    .filter((p) => p.language === locale)
    .sort((a, b) => a.order - b.order);
}

function getMockProjectBySlug(slug: string, locale: Locale): Project | null {
  return (
    mockProjects.find((p) => p.slug === slug && p.language === locale) ?? null
  );
}

function getMockAllSlugs(): { slug: string; locale: Locale }[] {
  // Deduplicate: same slug may appear for zh and en
  const seen = new Set<string>();
  const result: { slug: string; locale: Locale }[] = [];
  for (const p of mockProjects) {
    const key = `${p.slug}:${p.language}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push({ slug: p.slug, locale: p.language });
    }
  }
  return result;
}

export async function getProjects(locale: Locale): Promise<Project[]> {
  if (isNotionConfigured) {
    try {
      const { getNotionProjects } = await import("@/lib/notion/projects");
      return await getNotionProjects(locale);
    } catch (e) {
      console.warn("Notion fetch failed, using mock data:", (e as Error).message);
    }
  }
  return getMockProjects(locale);
}

export async function getFeaturedProjects(
  locale: Locale,
  count: number = 3
): Promise<Project[]> {
  const projects = await getProjects(locale);
  return projects.slice(0, count);
}

export async function getProjectBySlug(
  slug: string,
  locale: Locale
): Promise<Project | null> {
  if (isNotionConfigured) {
    try {
      const { getNotionProjectBySlug } = await import("@/lib/notion/projects");
      return await getNotionProjectBySlug(slug, locale);
    } catch (e) {
      console.warn("Notion fetch failed, using mock data:", (e as Error).message);
    }
  }
  return getMockProjectBySlug(slug, locale);
}

export async function getAllProjectSlugs(): Promise<
  { slug: string; locale: Locale }[]
> {
  if (isNotionConfigured) {
    try {
      const { getAllNotionProjectSlugs } = await import("@/lib/notion/projects");
      return await getAllNotionProjectSlugs();
    } catch (e) {
      console.warn("Notion fetch failed, using mock data:", (e as Error).message);
    }
  }
  return getMockAllSlugs();
}
