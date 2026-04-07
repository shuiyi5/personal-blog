import { notion, PROJECTS_DATABASE_ID } from "./client";
import { getPageContent } from "./blocks";
import type { Project, Locale } from "@/lib/data/types";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

function findProp(props: PageObjectResponse["properties"], name: string) {
  if (props[name]) return props[name];
  const key = Object.keys(props).find(
    (k) => k.toLowerCase() === name.toLowerCase()
  );
  return key ? props[key] : undefined;
}

function normalizeLocale(val: string): Locale {
  const lower = val.toLowerCase();
  if (lower === "zh" || lower === "en") return lower as Locale;
  return "zh";
}

function extractProjectMeta(page: PageObjectResponse): Omit<Project, "content"> {
  const props = page.properties;

  const nameProp = findProp(props, "Name");
  const name =
    nameProp?.type === "title"
      ? nameProp.title.map((t) => t.plain_text).join("")
      : "";

  const slugProp = findProp(props, "Slug");
  const slug =
    slugProp?.type === "rich_text"
      ? slugProp.rich_text.map((t) => t.plain_text).join("")
      : ""; // empty when Slug field not yet filled in Notion

  const descProp = findProp(props, "Description");
  const description =
    descProp?.type === "rich_text"
      ? descProp.rich_text.map((t) => t.plain_text).join("")
      : "";

  const langProp = findProp(props, "Language");
  const language =
    langProp?.type === "select" && langProp.select?.name
      ? normalizeLocale(langProp.select.name)
      : "zh";

  const roleProp = findProp(props, "Role");
  const role =
    roleProp?.type === "rich_text"
      ? roleProp.rich_text.map((t) => t.plain_text).join("")
      : "";

  const tagsProp = findProp(props, "Tags");
  const tags =
    tagsProp?.type === "multi_select"
      ? tagsProp.multi_select.map((t) => t.name)
      : [];

  const coverProp = findProp(props, "Cover");
  let cover: string | undefined;
  if (coverProp?.type === "files" && coverProp.files.length > 0) {
    const file = coverProp.files[0];
    cover =
      file.type === "file"
        ? file.file.url
        : file.type === "external"
          ? file.external.url
          : undefined;
  }

  const linkProp = findProp(props, "Link");
  const link =
    linkProp?.type === "url" ? linkProp.url ?? undefined : undefined;

  const githubProp = findProp(props, "GitHub");
  const github =
    githubProp?.type === "url" ? githubProp.url ?? undefined : undefined;

  const orderProp = findProp(props, "Order");
  const order =
    orderProp?.type === "number" ? orderProp.number ?? 0 : 0;

  return { id: page.id, slug, name, description, language, role, tags, cover, link, github, order };
}

/** Fetch all project pages (metadata only, no content blocks) */
async function fetchProjectsMeta(): Promise<Omit<Project, "content">[]> {
  const allPages: PageObjectResponse[] = [];
  let cursor: string | undefined = undefined;

  do {
    const response = await notion.databases.query({
      database_id: PROJECTS_DATABASE_ID,
      start_cursor: cursor,
    });
    allPages.push(...(response.results as PageObjectResponse[]));
    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);

  return allPages.map(extractProjectMeta);
}

export async function getNotionProjects(locale: Locale): Promise<Project[]> {
  const metas = await fetchProjectsMeta();
  return metas
    .filter((p) => p.language === locale)
    .sort((a, b) => a.order - b.order)
    .map((m) => ({ ...m, content: [] })); // list pages don't need content
}

export async function getNotionProjectBySlug(
  slug: string,
  locale: Locale
): Promise<Project | null> {
  const metas = await fetchProjectsMeta();
  const meta = metas.find((p) => p.slug === slug && p.language === locale);
  if (!meta) return null;
  const content = await getPageContent(meta.id);
  return { ...meta, content };
}

export async function getAllNotionProjectSlugs(): Promise<
  { slug: string; locale: Locale }[]
> {
  const metas = await fetchProjectsMeta();
  return metas
    .filter((p) => p.slug.length > 0)
    .map((p) => ({ slug: p.slug, locale: p.language }));
}
