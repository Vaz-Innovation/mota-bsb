import { Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { gqlQueryOptions } from "@/graphql/gqlpc";
import { HomeQuery } from "@/graphql/pages/home";
import { resolveWpLanguage } from "@/graphql/locale-to-wp-language";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const LatestNewsSection = () => {
  const { t } = useLanguage();
  const router = useRouter();
  const language = resolveWpLanguage(router.locale);

  const { data, isLoading } = useQuery(
    gqlQueryOptions(HomeQuery, {
      input: { language },
    }),
  );

  const posts = data?.posts?.nodes || [];

  if (!isLoading && posts.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4 font-serif">
            {t("news.title")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("news.subtitle")}
          </p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-5">
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-1/2 mb-3" />
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block"
              >
                <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg border-border/50">
                  <div className="relative h-48 overflow-hidden bg-muted">
                    {post.featuredImage?.node?.sourceUrl ? (
                      <Image
                        src={post.featuredImage.node.sourceUrl}
                        alt={post.featuredImage.node.altText || post.title || ""}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                        {t("blog.no_image")}
                      </div>
                    )}
                  </div>

                  <CardContent className="p-5 flex flex-col">
                    <h3 className="text-lg font-semibold text-navy mb-3 font-serif line-clamp-2 group-hover:text-gold transition-colors leading-snug">
                      {post.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                      <Calendar className="w-4 h-4 text-navy/60" />
                      {post.date && format(new Date(post.date), "d 'de' MMMM, yyyy", { locale: ptBR })}
                    </div>

                    {post.excerpt && (
                      <div
                        className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: post.excerpt }}
                      />
                    )}

                    <span className="inline-flex items-center gap-2 text-gold font-semibold text-sm group-hover:gap-3 transition-all duration-300 mt-auto">
                      {t("blog.read_more")}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-navy font-semibold hover:text-gold transition-colors"
          >
            {t("news.view_all")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
