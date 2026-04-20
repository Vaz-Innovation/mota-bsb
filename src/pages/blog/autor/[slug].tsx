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
import { AuthorPostCardFragment } from "@/graphql/pages/author";

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
    })
  );

  const author = data?.user;
  const posts = useMemo(() => data?.user?.posts?.nodes || [], [data]);
  const categories = useMemo(() => data?.categories?.nodes || [], [data]);

  const selectedCategory = query.category as string | undefined;

  // Filter posts by search term and category
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Use fragment to access post data for filtering
      const postData = useFragment(AuthorPostCardFragment, post);

      const matchesSearch =
        (postData.title || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (postData.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ??
          false);

      const matchesCategory =
        !selectedCategory ||
        postData.categories?.nodes?.some(
          (cat) => cat.slug === selectedCategory
        );

      return matchesSearch && matchesCategory;
    });
  }, [posts, searchTerm, selectedCategory]);

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
        { shallow: true }
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
    [slug]
  );

  if (!author && !isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground gap-6">
        <p className="text-2xl">Autor não encontrado</p>
        <Link href="/blog" className="text-primary hover:underline">
          {t("blog.back_to_blog")}
        </Link>
      </div>
    );
  }

  const structuredData = author
    ? {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        mainEntity: {
          "@type": "Person",
          name: author.name,
          email: author.email,
          image: author.avatar?.url,
          description: author.description,
        },
      }
    : null;

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={author?.name ? `Artigos de ${author.name}` : "Autor"}
        description={
          author?.description ||
          `Veja todos os artigos publicados por ${author?.name || "este autor"}`
        }
        localePathOverrides={localePathOverrides}
      />
      <Head>
        {structuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
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

          {author && <AuthorHeader author={author} />}

          <AuthorFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            categories={categories}
          />

          <AuthorPostsGrid posts={filteredPosts} isLoading={isLoading} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const data = await execute(AuthorSlugsQuery, { first: 100 });

    const paths = (data.users?.nodes || [])
      .map((node) => node?.slug)
      .filter(Boolean)
      .map((slug) => ({ params: { slug } }));

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
      })
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
