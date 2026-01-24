import { useState } from "react";
import { Search, Tag, Calendar, User, ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CookieBanner } from "@/components/CookieBanner";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  image: string;
  tags: string[];
  slug: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "STF começa a analisar regra que alterou aposentadoria por doença incurável",
    excerpt: "O Supremo Tribunal Federal (STF) iniciou a análise de um recurso que questiona se a aposentadoria por incapacidade permanente devido a doença incurável dev...",
    date: "6 de dezembro, 2025",
    author: "Isabela Vaz",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=250&fit=crop",
    tags: ["STF", "aposentadoria", "doença incurável"],
    slug: "stf-aposentadoria-doenca-incuravel"
  },
  {
    id: "2",
    title: "Reforma da Previdência: mudanças importantes para servidores públicos",
    excerpt: "Entenda as principais alterações trazidas pela reforma e como elas impactam diretamente os servidores públicos federais, estaduais e municipais...",
    date: "28 de novembro, 2025",
    author: "Rafael Mota",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=250&fit=crop",
    tags: ["Reforma da Previdência", "servidores públicos"],
    slug: "reforma-previdencia-servidores"
  },
  {
    id: "3",
    title: "INSS: novas regras para comprovação de incapacidade permanente",
    excerpt: "O Instituto Nacional do Seguro Social atualizou os procedimentos para perícias médicas e comprovação de incapacidade permanente...",
    date: "15 de novembro, 2025",
    author: "Mariana Velho",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=250&fit=crop",
    tags: ["INSS", "incapacidade permanente"],
    slug: "inss-incapacidade-permanente"
  },
];

const allTags = ["STF", "aposentadoria", "doença incurável", "Reforma da Previdência", "incapacidade permanente", "INSS"];

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const { t } = useLanguage();

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-navy mb-6 font-serif">
            Blog Jurídico
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Artigos, notícias e análises sobre as mais recentes mudanças na legislação e jurisprudência brasileira.
          </p>
        </div>
      </section>

      {/* Search and Tags */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Search */}
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar artigos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>

            {/* Tags */}
            <div className="flex items-center gap-3 flex-wrap">
              <Tag className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    selectedTag === tag 
                      ? "bg-navy text-white hover:bg-navy/90" 
                      : "hover:bg-muted"
                  }`}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                >
                  {tag}
                </Badge>
              ))}
              <Badge
                variant={!selectedTag ? "default" : "outline"}
                className={`cursor-pointer transition-all ${
                  !selectedTag 
                    ? "bg-navy text-white hover:bg-navy/90" 
                    : "hover:bg-muted"
                }`}
                onClick={() => setSelectedTag(null)}
              >
                Todos
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h2 className="text-lg font-semibold text-navy mb-3 font-serif line-clamp-2 group-hover:text-gold-light transition-colors">
                      {post.title}
                    </h2>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {post.author}
                      </span>
                    </div>

                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Read More */}
                    <a
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-gold-light font-semibold text-sm hover:gap-3 transition-all duration-300"
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
                Nenhum artigo encontrado com os filtros selecionados.
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
