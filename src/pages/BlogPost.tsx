import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, ArrowLeft, Tag, Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CookieBanner } from "@/components/CookieBanner";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  created_at: string;
  updated_at: string;
  image_url: string | null;
  tags: string[] | null;
  slug: string;
  meta_title: string | null;
  meta_description: string | null;
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  useEffect(() => {
    // Update page title and meta tags
    if (post) {
      document.title = post.meta_title || post.title;
      
      // Update meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', post.meta_description || post.excerpt || '');
    }
  }, [post]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setNotFound(true);
      } else {
        setPost(data);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-navy" />
        </div>
        <Footer />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <h1 className="text-4xl font-bold text-navy mb-4">{t("blog.article_not_found")}</h1>
          <p className="text-muted-foreground mb-8">
            {t("blog.article_not_found_description")}
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-gold font-semibold hover:gap-3 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("blog.back_to_blog")}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Estimate reading time (average 200 words per minute)
  const estimateReadingTime = (content: string) => {
    const text = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} ${t("blog.reading_time")}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <article className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Back Link */}
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-navy hover:text-gold transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("blog.back_to_blog")}
            </Link>

            {/* Article Header */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy mb-6 font-serif leading-tight">
              {post?.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-navy" />
                {post && formatDate(post.created_at)}
              </span>
              {post?.content && (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                    <path strokeWidth="2" d="M12 6v6l4 2"/>
                  </svg>
                  {estimateReadingTime(post.content)}
                </span>
              )}
            </div>

            {/* Featured Image */}
            {post?.image_url && (
              <div className="w-full aspect-video rounded-lg overflow-hidden mb-12">
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Lead/Excerpt */}
            {post?.excerpt && (
              <p className="text-lg md:text-xl font-medium text-navy/80 leading-relaxed mb-10 pb-8 border-b border-border">
                {post.excerpt}
              </p>
            )}

            {/* Content - Optimized for reading */}
            <div 
              className="
                max-w-[680px] mx-auto
                text-[17px] md:text-[18px]
                leading-[1.8]
                text-foreground
                
                [&>p]:mb-7
                [&>p]:leading-[1.8]
                
                [&>h2]:text-2xl [&>h2]:md:text-[28px]
                [&>h2]:font-serif [&>h2]:font-bold
                [&>h2]:text-navy
                [&>h2]:mt-14 [&>h2]:mb-6
                [&>h2]:leading-tight
                
                [&>h3]:text-xl [&>h3]:md:text-[22px]
                [&>h3]:font-serif [&>h3]:font-semibold
                [&>h3]:text-navy
                [&>h3]:mt-10 [&>h3]:mb-5
                [&>h3]:leading-tight
                
                [&>h4]:text-lg [&>h4]:md:text-xl
                [&>h4]:font-serif [&>h4]:font-semibold
                [&>h4]:text-navy
                [&>h4]:mt-8 [&>h4]:mb-4
                
                [&>ul]:my-6 [&>ul]:pl-6
                [&>ul>li]:mb-3 [&>ul>li]:leading-[1.7]
                [&>ul>li]:relative [&>ul>li]:pl-2
                
                [&>ol]:my-6 [&>ol]:pl-6
                [&>ol>li]:mb-3 [&>ol>li]:leading-[1.7]
                [&>ol>li]:pl-2
                
                [&>blockquote]:my-8 [&>blockquote]:py-4
                [&>blockquote]:pl-6 [&>blockquote]:pr-4
                [&>blockquote]:border-l-4 [&>blockquote]:border-gold
                [&>blockquote]:bg-muted/30 [&>blockquote]:rounded-r-lg
                [&>blockquote]:italic [&>blockquote]:text-muted-foreground
                [&>blockquote>p]:mb-0
                
                [&>strong]:text-navy [&>strong]:font-semibold
                [&_strong]:text-navy [&_strong]:font-semibold
                
                [&>a]:text-gold [&>a]:underline [&>a]:underline-offset-2
                [&>a:hover]:text-gold-dark
                [&_a]:text-gold [&_a]:underline [&_a]:underline-offset-2
                [&_a:hover]:text-gold-dark
                
                [&>hr]:my-10 [&>hr]:border-border
                
                [&>img]:my-8 [&>img]:rounded-lg [&>img]:w-full
                [&_img]:my-8 [&_img]:rounded-lg [&_img]:max-w-full
              "
              dangerouslySetInnerHTML={{ __html: post?.content || '' }}
            />

            {/* Tags */}
            {post?.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-border">
                {post.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-slate-100 text-navy hover:bg-slate-200"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Back to Blog Button */}
            <div className="flex justify-center mt-12">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-lg font-semibold hover:bg-navy-deep transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {t("blog.see_more_articles")}
              </Link>
            </div>
          </div>
        </div>
      </article>

      <Footer />
      <WhatsAppButton />
      <CookieBanner />
    </div>
  );
}
