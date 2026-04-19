import { useState, useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";

import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import type { GetStaticProps } from "next";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import SEO from "@/components/SEO";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, Search, ArrowRight, Filter } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useLanguage } from "@/contexts/LanguageContext";
import { gqlQueryOptions } from "@/graphql/gqlpc";
import { BlogListQuery } from "@/graphql/pages/blog";
import { resolveWpLanguage } from "@/graphql/locale-to-wp-language";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Blog = () => {
  const { t } = useLanguage();
  const router = useRouter();
  const { locale, query } = router;
  const language = resolveWpLanguage(locale);

  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useQuery(
    gqlQueryOptions(BlogListQuery, {
      input: { language, first: 100 },
    }),
  );

  const posts = useMemo(() => data?.posts?.nodes || [], [data]);
  const categories = useMemo(() => data?.categories?.nodes || [], [data]);

  const selectedCategory = query.category as string | undefined;

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch =
        (post.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ??
          false);

      const matchesCategory =
        !selectedCategory ||
        post.categories?.nodes?.some(cat => cat.slug === selectedCategory);

      return matchesSearch && matchesCategory;
    });
  }, [posts, searchTerm, selectedCategory]);

  const localePathOverrides = useMemo(() => ({
    'pt-BR': '/blog',
    'es-ES': '/blog',
    'en-US': '/blog',
    'de-DE': '/blog',
    'it-IT': '/blog',
    'fr-FR': '/blog',
    'zh-CN': '/blog',
  }), []);

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

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog Mota Advogados",
    description: t("blog.subtitle"),
    publisher: {
      "@type": "Organization",
      name: "Mota & Advogados Associados",
    },
    blogPost: filteredPosts.map(post => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      url: `/blog/${post.slug}`,
    })),
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title={t("blog.title")} 
        description={t("blog.subtitle")} 
        localePathOverrides={localePathOverrides}
      />
      <Head>
        <meta
          name="keywords"
          content="blog jurídico, direito, legislação, jurisprudência, advocacia, Mota Advogados"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <Header pathOverrides={localePathOverrides} />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <section className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              {t("blog.title")}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("blog.subtitle")}
            </p>
          </section>

          <section className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("blog.search_placeholder")}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <Filter className="h-4 w-4 text-muted-foreground hidden md:block" />
                <Select
                  value={selectedCategory || "all"}
                  onValueChange={(value) => handleCategoryChange(value === "all" ? null : value)}
                >
                  <SelectTrigger className="w-full md:w-[240px]">
                    <SelectValue placeholder={t("blog.all")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("blog.all")}</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.slug || ""}>
                        {category.name} ({category.count || 0})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          <section>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-muted rounded-t-lg" />
                    <CardHeader>
                      <div className="h-6 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-1/2 mt-2" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 bg-muted rounded w-full" />
                      <div className="h-4 bg-muted rounded w-2/3 mt-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map(post => (
                  <article key={post.id}>
                    <Link href={`/blog/${post.slug}`}>
                      <Card className="h-full hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
                        {post.featuredImage?.node?.sourceUrl && (
                          <div className="relative h-48 overflow-hidden">
                            <Image
                              src={post.featuredImage.node.sourceUrl}
                              alt={
                                post.featuredImage.node.altText ||
                                post.title ||
                                ""
                              }
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            {post.categories?.nodes?.[0] && (
                              <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                                {post.categories.nodes[0].name}
                              </Badge>
                            )}
                          </div>
                        )}
                        <CardHeader>
                          <CardTitle className="text-lg group-hover:text-accent transition-colors line-clamp-2">
                            {post.title}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {post.date &&
                                format(
                                  new Date(post.date),
                                  "d 'de' MMMM, yyyy",
                                  { locale: ptBR },
                                )}
                            </span>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {post.excerpt && (
                            <div
                              className="text-muted-foreground text-sm line-clamp-3 mb-4"
                              dangerouslySetInnerHTML={{ __html: post.excerpt }}
                            />
                          )}
                          <div className="flex items-center text-accent text-sm font-medium">
                            {t("blog.read_more")}{" "}
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const queryClient = new QueryClient();
  const language = resolveWpLanguage(locale);

  try {
    await queryClient.prefetchQuery(
      gqlQueryOptions(BlogListQuery, {
        input: { language, first: 100 },
      }),
    );
  } catch (error) {
    console.warn("Retrying BlogListQuery prefetch failed:", error);
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60,
  };
};

export default Blog;
