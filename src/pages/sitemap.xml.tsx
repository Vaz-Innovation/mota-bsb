import type { GetServerSideProps } from "next";

import { execute } from "@/graphql/execute";
import {
  localeToWpLanguage,
  resolveWpLanguage,
  type SupportedLocale,
} from "@/graphql/locale-to-wp-language";
import { BlogPostSlugsQuery } from "@/graphql/pages/blog";

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

const DEFAULT_SITE_URL = "https://mota-bsb.vercel.app";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function resolveBaseUrl(req: Parameters<GetServerSideProps>[0]["req"]): string {
  const envBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  if (envBaseUrl) {
    return envBaseUrl.replace(/\/$/, "");
  }

  const protoHeader = req.headers["x-forwarded-proto"];
  const protocol = Array.isArray(protoHeader)
    ? protoHeader[0]
    : protoHeader?.split(",")[0] || "https";

  const hostHeader = req.headers["x-forwarded-host"] || req.headers.host;
  const host = Array.isArray(hostHeader) ? hostHeader[0] : hostHeader;

  if (!host) {
    return DEFAULT_SITE_URL;
  }

  return `${protocol}://${host}`.replace(/\/$/, "");
}

function localePrefix(locale: SupportedLocale): string {
  return locale === "pt-BR" ? "" : `/${locale}`;
}

async function fetchAllPostSlugs(locale: SupportedLocale): Promise<string[]> {
  const slugs: string[] = [];
  let afterCursor: string | null = null;

  while (true) {
    const data: any = await execute(BlogPostSlugsQuery, {
      language: resolveWpLanguage(locale),
      first: 100,
      after: afterCursor,
    });

    const nodes = data.posts?.nodes || [];
    for (const node of nodes) {
      if (node?.slug) {
        slugs.push(node.slug);
      }
    }

    const pageInfo: any = data.posts?.pageInfo;
    if (!pageInfo?.hasNextPage || !pageInfo.endCursor) {
      break;
    }

    afterCursor = pageInfo.endCursor;
  }

  return slugs;
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const baseUrl = resolveBaseUrl(req);
  const locales = Object.keys(localeToWpLanguage) as SupportedLocale[];

  const postsByLocale = await Promise.all(
    locales.map(async (locale) => ({
      locale,
      slugs: await fetchAllPostSlugs(locale),
    })),
  );

  const urls = new Set<string>();
  for (const locale of locales) {
    const prefix = localePrefix(locale);
    urls.add(`${baseUrl}${prefix}/`);
    urls.add(`${baseUrl}${prefix}/blog`);
    // Add other static pages
    urls.add(`${baseUrl}${prefix}/avalie`);
    urls.add(`${baseUrl}${prefix}/trabalhe-conosco`);
  }

  for (const { locale, slugs } of postsByLocale) {
    const prefix = localePrefix(locale);
    for (const slug of slugs) {
      urls.add(`${baseUrl}${prefix}/blog/${slug}`);
    }
  }

  const urlEntries = Array.from(urls)
    .sort((a, b) => a.localeCompare(b))
    .map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`)
    .join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;