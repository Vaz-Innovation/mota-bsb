import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string | null;
  created_at: string;
  image_url: string | null;
  slug: string;
  title_en: string | null;
  title_es: string | null;
  title_de: string | null;
  title_it: string | null;
  title_fr: string | null;
  title_zh: string | null;
  excerpt_en: string | null;
  excerpt_es: string | null;
  excerpt_de: string | null;
  excerpt_it: string | null;
  excerpt_fr: string | null;
  excerpt_zh: string | null;
}

export const LatestNewsSection = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, locale, language } = useLanguage();

  const getTranslatedField = (post: BlogPost, field: 'title' | 'excerpt') => {
    if (language === 'PT') return field === 'title' ? post.title : post.excerpt;
    
    const langKey = language.toLowerCase() as 'en' | 'es' | 'de' | 'it' | 'fr' | 'zh';
    const translatedField = post[`${field}_${langKey}` as keyof BlogPost] as string | null;
    
    return translatedField || (field === 'title' ? post.title : post.excerpt);
  };

  useEffect(() => {
    fetchLatestPosts();
  }, []);

  const fetchLatestPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, excerpt, created_at, image_url, slug, title_en, title_es, title_de, title_it, title_fr, title_zh, excerpt_en, excerpt_es, excerpt_de, excerpt_it, excerpt_fr, excerpt_zh")
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      if (data) setPosts(data as BlogPost[]);
    } catch (error) {
      console.error("Error fetching latest posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Don't render section if no posts
  if (!loading && posts.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4 font-serif">
            {t("news.title")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("news.subtitle")}
          </p>
        </div>

        {/* Cards Grid */}
        {loading ? (
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
                to={`/blog/${post.slug}`}
                className="group block"
              >
                <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg border-border/50">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-muted">
                    {post.image_url ? (
                      <img
                        src={post.image_url}
                        alt={getTranslatedField(post, 'title') || post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <span className="text-sm">{t("blog.no_image")}</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <CardContent className="p-5 flex flex-col">
                    <h3 className="text-lg font-semibold text-navy mb-3 font-serif line-clamp-2 group-hover:text-gold transition-colors leading-snug">
                      {getTranslatedField(post, 'title')}
                    </h3>

                    {/* Date */}
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                      <Calendar className="w-4 h-4 text-navy/60" />
                      {formatDate(post.created_at)}
                    </div>

                    {getTranslatedField(post, 'excerpt') && (
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                        {getTranslatedField(post, 'excerpt')}
                      </p>
                    )}

                    {/* Read More */}
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

        {/* View All Link */}
        <div className="text-center mt-10">
          <Link
            to="/blog"
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
