import { useState, useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";

import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import type { GetStaticPaths, GetStaticProps } from "next";
import { ArrowLeft } from "lucide-react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import SEO from "@/components/SEO";
import {
  AuthorHeader,
  AuthorFilters,
  AuthorPostsGrid,
} from "@/components/blog/author";
import { useLanguage } from "@/contexts/LanguageContext";
import { gqlQueryOptions } from "@/graphql/gqlpc";
import { AuthorBySlugQuery, AuthorSlugsQuery } from "@/graphql/pages/author";
import { execute } from "@/graphql/execute";
import { resolveWpLanguage } from "@/graphql/locale-to-wp-language";
import { useFragment } from "@/graphql/__gen__/fragment-masking";
import {
  AuthorPostCardFragment,
  AuthorCardFragment,
} from "@/graphql/pages/author";

interface AuthorPageProps {
  slug: string;
}

export default function AuthorPage({ slug }: AuthorPageProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const { locale, query } = router;
  const language = resolveWpLanguage(locale);

  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useQuery(
    gqlQueryOptions(AuthorBySlugQuery, {
      input: { slug, first: 100, language },
    }),
  );

  const authorFragment = data?.user;
  const author = useFragment(AuthorCardFragment, authorFragment);
  const posts = useMemo(() => data?.user?.posts?.nodes || [], [data]);
  const categories = useMemo(() => data?.categories?.nodes || [], [data]);

  const selectedCategory = query.category as string | undefined;

  // Note: Filtering is handled in AuthorPostsGrid component
  // which uses useFragment properly for each post

  const handleCategoryChange = (slug: string | null) => {
    if (!slug) {
      const { category, ...restQuery } = query;
      router.push({ pathname: router.pathname, query: restQuery }, undefined, {
        shallow: true,
      });
    } else {
      router.push(
        { pathname: router.pathname, query: { ...query, category: slug } },
        undefined,
        { shallow: true },
      );
    }
  };

  const localePathOverrides = useMemo(
    () => ({
      "pt-BR": `/blog/autor/${slug}`,
      "es-ES": `/blog/autor/${slug}`,
      "en-US": `/blog/autor/${slug}`,
      "de-DE": `/blog/autor/${slug}`,
      "it-IT": `/blog/autor/${slug}`,
      "fr-FR": `/blog/autor/${slug}`,
      "zh-CN": `/blog/autor/${slug}`,
    }),
    [slug],
  );

  if (!authorFragment && !isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground gap-6">
        <p className="text-2xl">Autor não encontrado</p>
        <Link href="/blog" className="text-primary hover:underline">
          {t("blog.back_to_blog")}
        </Link>
      </div>
    );
  }

  // Parse author name for profile meta
  const nameParts = author?.name?.split(" ") || [];
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  // SEO description
  const seoDescription = author?.description?.slice(0, 160) ||
    `Confira todos os artigos jurídicos publicados por ${author?.name || "este autor"} no blog da Mota & Advogados Associados. Conteúdo especializado em direito.`;

  // Keywords for author page
  const authorKeywords = [
    author?.name,
    "advogado",
    "artigos jurídicos",
    "Mota Advogados",
    "direito",
    "advocacia",
  ].filter(Boolean) as string[];

  const structuredData = authorFragment
    ? {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "@id": `https://mota.adv.br/blog/autor/${slug}#profile`,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://mota.adv.br/blog/autor/${slug}`,
        },
        mainEntity: {
          "@type": "Person",
          "@id": `https://mota.adv.br/blog/autor/${slug}#person`,
          name: author?.name,
          givenName: firstName,
          familyName: lastName,
          email: author?.email,
          image: author?.avatar?.url ? {
            "@type": "ImageObject",
            url: author.avatar.url,
            width: 96,
            height: 96,
          } : undefined,
          description: author?.description,
          url: `https://mota.adv.br/blog/autor/${slug}`,
          worksFor: {
            "@type": "Organization",
            name: "Mota & Advogados Associados",
            url: "https://mota.adv.br",
          },
          jobTitle: "Advogado",
        },
        dateModified: new Date().toISOString(),
      }
    : null;

  // BreadcrumbList structured data
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://mota.adv.br",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://mota.adv.br/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: author?.name || "Autor",
        item: `https://mota.adv.br/blog/autor/${slug}`,
      },
    ],
  };

  // CollectionPage structured data for author's posts
  const collectionData = authorFragment && posts.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Artigos de ${author?.name}`,
    description: seoDescription,
    url: `https://mota.adv.br/blog/autor/${slug}`,
    author: {
      "@type": "Person",
      name: author?.name,
    },
    numberOfItems: posts.length,
    isPartOf: {
      "@type": "Blog",
      name: "Blog Mota & Advogados Associados",
      url: "https://mota.adv.br/blog",
    },
  } : null;

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={author?.name ? `Artigos de ${author.name}` : "Autor"}
        description={seoDescription}
        image={author?.avatar?.url}
        imageAlt={author?.name ? `Foto de ${author.name}` : "Foto do autor"}
        profile
        profileMeta={{
          firstName,
          lastName,
          username: slug,
        }}
        keywords={authorKeywords}
        localePathOverrides={localePathOverrides}
      />
      <Head>
        {structuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
        />
        {collectionData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionData) }}
          />
        )}
      </Head>

      <Header pathOverrides={localePathOverrides} />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("blog.back_to_blog")}
          </Link>

          {authorFragment && <AuthorHeader author={authorFragment} />}

          <AuthorFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            categories={categories}
          />

          <AuthorPostsGrid
            posts={posts}
            isLoading={isLoading}
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const data = await execute(AuthorSlugsQuery, { first: 100 });

    const slugs = (data.users?.nodes || [])
      .map((node) => node?.slug)
      .filter(
        (slug): slug is string => typeof slug === "string" && slug.length > 0,
      );

    const paths = slugs.map((slug) => ({ params: { slug } }));

    return {
      paths,
      fallback: "blocking",
    };
  } catch (error) {
    console.error("Error fetching author slugs:", error);
    return {
      paths: [],
      fallback: "blocking",
    };
  }
};

export const getStaticProps: GetStaticProps<AuthorPageProps> = async ({
  params,
  locale,
}) => {
  const slug = params?.slug as string;

  if (!slug) {
    return { notFound: true };
  }

  const queryClient = new QueryClient();
  const language = resolveWpLanguage(locale);

  try {
    await queryClient.prefetchQuery(
      gqlQueryOptions(AuthorBySlugQuery, {
        input: { slug, first: 100, language },
      }),
    );
  } catch (error) {
    console.error(`Error prefetching author ${slug}:`, error);
  }

  return {
    props: {
      slug,
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60,
  };
};
