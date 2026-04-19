import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';

import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import SEO from '@/components/SEO';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { gqlQueryOptions } from '@/graphql/gqlpc';
import { BlogPostBySlugQuery, BlogPostSlugsQuery } from '@/graphql/pages/blog';
import { execute } from '@/graphql/execute';
import { resolveWpLanguage } from '@/graphql/locale-to-wp-language';
import { useLanguage } from '@/contexts/LanguageContext';

export default function BlogPostPage({ slug }: { slug: string }) {
  const { t } = useLanguage();
  const router = useRouter();
  const { data, isLoading } = useQuery(
    gqlQueryOptions(BlogPostBySlugQuery, { input: { slug } }),
  );

  const post = data?.post;

  if (isLoading && !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-lg text-muted-foreground">Carregando artigo...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground gap-6">
        <p className="text-2xl">{t("blog.article_not_found")}</p>
        <Link
          href="/blog"
          className="text-primary hover:underline"
        >
          {t("blog.back_to_blog")}
        </Link>
      </div>
    );
  }

  const localePathOverrides = post.translations?.reduce((acc: any, translation: any) => {
    if (translation?.language?.locale && translation?.slug) {
      acc[translation.language.locale] = `/blog/${translation.slug}`;
    }
    return acc;
  }, {} as Record<string, string>);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": post.featuredImage?.node?.sourceUrl,
    "datePublished": post.date,
    "author": {
      "@type": "Person",
      "name": post.author?.node?.name || "Mota & Advogados Associados"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Mota & Advogados Associados",
      "logo": {
        "@type": "ImageObject",
        "url": "https://mota.adv.br/logo.png"
      }
    },
    "description": post.excerpt?.replace(/<[^>]*>/g, ''),
    "inLanguage": post.language?.code
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title={post.title || ""} 
        description={post.excerpt?.replace(/<[^>]*>/g, '')}
        image={post.featuredImage?.node?.sourceUrl || ""}
        article
        localePathOverrides={localePathOverrides}
      />
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </Head>


      <Header pathOverrides={localePathOverrides} />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("blog.back_to_blog")}
          </Link>

          <article>
            <header className="mb-12">
              <div className="flex flex-wrap gap-2 mb-4">
                {post.categories?.nodes?.map((cat: any) => (
                  <Badge key={cat.id} variant="secondary" className="bg-accent/10 text-accent hover:bg-accent/20">
                    {cat.name}
                  </Badge>
                ))}
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold text-primary mb-6 leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-muted-foreground text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {post.date && format(new Date(post.date), "d 'de' MMMM, yyyy", { locale: ptBR })}
                </div>
                {post.author?.node?.name && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {post.author.node.name}
                  </div>
                )}
              </div>
            </header>

            {post.featuredImage?.node?.sourceUrl && (
              <div className="relative aspect-video mb-12 rounded-xl overflow-hidden shadow-xl">
                <Image
                  src={post.featuredImage.node.sourceUrl}
                  alt={post.featuredImage.node.altText || post.title || ''}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <div 
              className="blog-content mb-12"
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />

            <Separator className="my-12" />
            
            {post.tags?.nodes && post.tags.nodes.length > 0 && (
              <div className="flex items-center gap-3 mb-12">
                <Tag className="h-5 w-5 text-muted-foreground" />
                <div className="flex flex-wrap gap-2">
                  {post.tags.nodes.map((tag: any) => (
                    <Badge key={tag.id} variant="outline" className="font-normal">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  const paths: any[] = [];
  const activeLocales = locales || ["pt-BR"];

  for (const locale of activeLocales) {
    try {
      const data = await execute(BlogPostSlugsQuery, {
        language: resolveWpLanguage(locale),
        first: 100,
      });

      const localePaths = (data.posts?.nodes || [])
        .map((node) => node?.slug)
        .filter(Boolean)
        .map((slug) => ({ params: { slug }, locale }));

      paths.push(...localePaths);
    } catch (error) {
      console.error(`Error fetching slugs for locale ${locale}:`, error);
    }
  }

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const slug = params?.slug as string;

  if (!slug) {
    return { notFound: true };
  }

  const queryClient = new QueryClient();
  const language = resolveWpLanguage(locale);

  try {
    await queryClient.prefetchQuery(
      gqlQueryOptions(BlogPostBySlugQuery, { input: { slug } }),
    );
  } catch (error) {
    console.error(`Error prefetching post ${slug}:`, error);
  }

  return {
    props: {
      slug,
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60,
  };
};
