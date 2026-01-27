import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, ArrowLeft, Tag, Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CookieBanner } from "@/components/CookieBanner";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

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
          <h1 className="text-4xl font-bold text-navy mb-4">Artigo não encontrado</h1>
          <p className="text-muted-foreground mb-8">
            O artigo que você está procurando não existe ou foi removido.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-gold font-semibold hover:gap-3 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para o Blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Image */}
      {post?.image_url && (
        <div className="w-full h-64 md:h-96 relative mt-20">
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
        </div>
      )}

      {/* Article Content */}
      <article className={`${post?.image_url ? '-mt-20 relative z-10' : 'pt-32'}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {/* Back Link */}
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-navy transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para o Blog
            </Link>

            {/* Article Header */}
            <div className="bg-background rounded-lg p-6 md:p-10 shadow-lg mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy mb-6 font-serif leading-tight">
                {post?.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6 pb-6 border-b">
                <span className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gold" />
                  {post && formatDate(post.created_at)}
                </span>
              </div>

              {/* Tags */}
              {post?.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
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

              {/* Lead/Excerpt */}
              {post?.excerpt && (
                <p className="text-lg md:text-xl font-medium text-navy/80 mb-8 leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              {/* Content */}
              <div 
                className="prose prose-lg max-w-none
                  prose-headings:text-navy prose-headings:font-serif
                  prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-5
                  prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                  prose-p:text-foreground prose-p:leading-relaxed prose-p:mb-6
                  prose-li:text-foreground prose-li:leading-relaxed
                  prose-ul:mb-6 prose-ol:mb-6
                  prose-strong:text-navy
                  prose-a:text-gold prose-a:no-underline hover:prose-a:underline
                  prose-blockquote:border-l-4 prose-blockquote:border-gold prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-muted-foreground
                "
                dangerouslySetInnerHTML={{ __html: post?.content || '' }}
              />
            </div>

            {/* Related Posts / Navigation */}
            <div className="flex justify-center mb-12">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-lg font-semibold hover:bg-navy/90 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Ver mais artigos
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
