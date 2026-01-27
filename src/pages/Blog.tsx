import { useState } from "react";
import { Search, Calendar, User, ArrowRight, Tag, ChevronDown } from "lucide-react";
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
    date: "26 de janeiro, 2026",
    author: "Isabela Vaz",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=250&fit=crop",
    tags: ["STF", "aposentadoria"],
    slug: "stf-aposentadoria-doenca-incuravel"
  },
  {
    id: "2",
    title: "Reforma da Previdência: mudanças importantes para servidores públicos",
    excerpt: "Entenda as principais alterações trazidas pela reforma e como elas impactam diretamente os servidores públicos federais, estaduais e municipais...",
    date: "26 de janeiro, 2026",
    author: "Rafael Mota",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=250&fit=crop",
    tags: ["Reforma da Previdência", "servidores públicos"],
    slug: "reforma-previdencia-servidores"
  },
  {
    id: "3",
    title: "INSS: novas regras para comprovação de incapacidade permanente",
    excerpt: "O Instituto Nacional do Seguro Social atualizou os procedimentos para perícias médicas e comprovação de incapacidade permanente...",
    date: "26 de janeiro, 2026",
    author: "Mariana Velho",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=250&fit=crop",
    tags: ["INSS", "incapacidade permanente"],
    slug: "inss-incapacidade-permanente"
  },
  {
    id: "4",
    title: "Acordo histórico: Governo Federal reajusta Auxílio Alimentação em 17,5%",
    excerpt: "Compromisso com a valorização do funcionalismo público: o Governo Federal e entidades representativas de servidores assinam um novo acordo que garante o...",
    date: "26 de janeiro, 2026",
    author: "Isabela Vaz",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop",
    tags: ["Governo Federal", "servidores públicos"],
    slug: "acordo-auxilio-alimentacao"
  },
  {
    id: "5",
    title: "Decreto Moderniza o Vale-Alimentação e Vale-Refeição no Brasil",
    excerpt: "Um novo decreto traz mudanças significativas para o vale-alimentação e vale-refeição no Brasil, prometendo mais concorrência, liberdade de escolha para os beneficiários...",
    date: "26 de janeiro, 2026",
    author: "Isabela Vaz",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop",
    tags: ["Decreto", "vale-alimentação"],
    slug: "decreto-vale-alimentacao"
  },
  {
    id: "6",
    title: "MP Federal Reajusta Salários de Forças de Segurança no DF",
    excerpt: "Entenda a Medida Provisória assinada pelo Presidente Lula que reajusta a remuneração de policiais militares, bombeiros e outras forças de segurança do Distrito...",
    date: "26 de janeiro, 2026",
    author: "Isabela Vaz",
    image: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=400&h=250&fit=crop",
    tags: ["MP Federal", "segurança"],
    slug: "mp-federal-seguranca-df"
  },
];

const allTags = ["STF", "aposentadoria", "Reforma da Previdência", "servidores públicos", "INSS", "incapacidade permanente", "Governo Federal", "Decreto", "MP Federal"];

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
          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-background group"
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden rounded-lg mb-4">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
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
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <User className="w-4 h-4 text-gold" />
                        {post.author}
                      </span>
                    </div>

                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

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