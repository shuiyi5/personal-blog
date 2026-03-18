import { notion, POSTS_DATABASE_ID } from "./client";
import { getPageContent } from "./blocks";
import type { Post, Locale, Category, PostStatus } from "@/lib/data/types";
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

function normalizeStatus(val: string): PostStatus {
  if (val.toLowerCase() === "published") return "Published";
  return "Draft";
}

function extractPostProps(page: PageObjectResponse): Omit<Post, "content"> {
  const props = page.properties;

  const titleProp = findProp(props, "Title");
  const title =
    titleProp?.type === "title"
      ? titleProp.title.map((t) => t.plain_text).join("")
      : "";

  const slugProp = findProp(props, "Slug");
  const slug =
    slugProp?.type === "rich_text"
      ? slugProp.rich_text.map((t) => t.plain_text).join("")
      : "";

  const langProp = findProp(props, "Language");
  const language =
    langProp?.type === "select" && langProp.select?.name
      ? normalizeLocale(langProp.select.name)
      : "zh";

  const statusProp = findProp(props, "Status");
  const status =
    statusProp?.type === "select" && statusProp.select?.name
      ? normalizeStatus(statusProp.select.name)
      : "Draft";

  const catProp = findProp(props, "Category");
  const category =
    catProp?.type === "select"
      ? (catProp.select?.name as Category) ?? "AI Product Analysis"
      : "AI Product Analysis";

  const tagsProp = findProp(props, "Tags");
  const tags =
    tagsProp?.type === "multi_select"
      ? tagsProp.multi_select.map((t) => t.name)
      : [];

  const summaryProp = findProp(props, "Summary");
  const summary =
    summaryProp?.type === "rich_text"
      ? summaryProp.rich_text.map((t) => t.plain_text).join("")
      : "";

  const dateProp = findProp(props, "Date");
  const date =
    dateProp?.type === "date" ? dateProp.date?.start ?? "" : "";

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

  return {
    id: page.id,
    title,
    slug,
    language,
    status,
    category,
    tags,
    summary,
    date,
    cover,
  };
}

/**
 * FAST: Fetch post metadata only (no content blocks).
 * Used by list pages, home page, sitemap — anything that doesn't need article body.
 * Single API call, returns in ~200ms.
 */
async function fetchPostsMeta(): Promise<Omit<Post, "content">[]> {
  const allPages: PageObjectResponse[] = [];
  let cursor: string | undefined = undefined;

  do {
    const response = await notion.databases.query({
      database_id: POSTS_DATABASE_ID,
      start_cursor: cursor,
    });
    allPages.push(...(response.results as PageObjectResponse[]));
    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);

  return allPages.map(extractPostProps);
}

/**
 * SLOW: Fetch a single post WITH full content blocks.
 * Only used by the article detail page.
 */
async function fetchSinglePost(
  pageId: string,
  meta: Omit<Post, "content">
): Promise<Post> {
  const content = await getPageContent(pageId);
  return { ...meta, content };
}

// ─── Exported API ───

export async function getNotionPosts(locale: Locale): Promise<Post[]> {
  const metas = await fetchPostsMeta();
  return metas
    .filter((p) => p.language === locale && p.status === "Published")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((m) => ({ ...m, content: [] })); // List pages don't need content
}

export async function getNotionPostBySlug(
  slug: string,
  locale: Locale
): Promise<Post | null> {
  const metas = await fetchPostsMeta();
  const meta = metas.find(
    (p) =>
      p.slug === slug && p.language === locale && p.status === "Published"
  );
  if (!meta) return null;
  // Only fetch content blocks for THIS one post
  return fetchSinglePost(meta.id, meta);
}

export async function getAllNotionPublishedSlugs(): Promise<
  { slug: string; locale: Locale }[]
> {
  const metas = await fetchPostsMeta();
  return metas
    .filter((p) => p.status === "Published")
    .map((p) => ({ slug: p.slug, locale: p.language }));
}
