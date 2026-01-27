import { useState, useEffect } from "react";
import { Search, Calendar, User, ArrowRight, Tag, ChevronDown, Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CookieBanner } from "@/components/CookieBanner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string | null;
  created_at: string;
  image_url: string | null;
  tags: string[] | null;
  slug: string;
}

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, excerpt, created_at, image_url, tags, slug")
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        setPosts(data);
        
        // Extract all unique tags
        const tags = new Set<string>();
        data.forEach((post) => {
          post.tags?.forEach((tag) => tags.add(tag));
        });
        setAllTags(Array.from(tags).sort());
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesTag = !selectedTag || post.tags?.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-background">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-navy mb-4 font-serif">
            Blog Jurídico
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Artigos, notícias e análises sobre as mais recentes mudanças na legislação e jurisprudência brasileira.
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-6 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Left side: Search + Tags dropdown */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar artigos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-background border-border h-10 text-sm"
                />
              </div>

              {/* Tags Dropdown */}
              {allTags.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2 h-10 text-sm font-normal">
                      <Tag className="w-4 h-4 text-muted-foreground" />
                      {selectedTag || "Todas as tags"}
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuItem 
                      onClick={() => setSelectedTag(null)}
                      className={!selectedTag ? "bg-muted" : ""}
                    >
                      Todas as tags
                    </DropdownMenuItem>
                    {allTags.map((tag) => (
                      <DropdownMenuItem
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={selectedTag === tag ? "bg-muted" : ""}
                      >
                        {tag}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Right side: "Todos" button */}
            <Button 
              variant={!selectedTag && !searchTerm ? "default" : "outline"}
              className={`h-10 px-6 text-sm ${!selectedTag && !searchTerm ? "bg-navy hover:bg-navy-deep text-white" : ""}`}
              onClick={() => {
                setSelectedTag(null);
                setSearchTerm("");
              }}
            >
              Todos
            </Button>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-8 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-navy" />
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-background group"
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden rounded-lg mb-4 bg-slate-200">
                    {post.image_url ? (
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <span className="text-sm">Sem imagem</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div>
                    <h2 className="text-lg font-semibold text-navy mb-3 font-serif line-clamp-2 group-hover:text-navy-deep transition-colors leading-snug">
                      {post.title}
                    </h2>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-gold" />
                        {formatDate(post.created_at)}
                      </span>
                    </div>

                    {post.excerpt && (
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Read More */}
                    <a
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-gold font-semibold text-sm hover:gap-3 transition-all duration-300"
                    >
                      Ler mais
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                {posts.length === 0 
                  ? "Nenhum artigo publicado ainda." 
                  : "Nenhum artigo encontrado com os filtros selecionados."}
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <CookieBanner />
    </div>
  );
}
