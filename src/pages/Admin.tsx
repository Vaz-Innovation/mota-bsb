import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  FolderOpen,
  Edit,
  Home,
  Eye,
  LogOut,
  Plus,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logoWhite from "@/assets/logo-white.png";

interface BlogPost {
  id: string;
  title: string;
  status: string;
  created_at: string;
  category_id: string | null;
}

interface Category {
  id: string;
  name: string;
}

export default function Admin() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"posts" | "categories">("posts");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/auth");
      } else if (!isAdmin) {
        navigate("/");
      }
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoadingData(true);
    
    const [postsRes, categoriesRes] = await Promise.all([
      supabase.from("blog_posts").select("*").order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("name"),
    ]);

    if (postsRes.data) setPosts(postsRes.data);
    if (categoriesRes.data) setCategories(categoriesRes.data);
    
    setLoadingData(false);
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este post?")) return;

    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    
    if (error) {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Post excluído com sucesso!" });
      fetchData();
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const stats = {
    totalPosts: posts.length,
    publishedPosts: posts.filter((p) => p.status === "published").length,
    draftPosts: posts.filter((p) => p.status === "draft").length,
    totalCategories: categories.length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-beige-light flex items-center justify-center">
        <div className="text-navy">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-light">
      {/* Header */}
      <header className="bg-navy text-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logoWhite} alt="Logo" className="h-8" />
            <div>
              <h1 className="text-lg font-bold">Painel Administrativo</h1>
              <p className="text-sm text-white/70">Gerenciamento do Blog</p>
            </div>
          </div>

          <nav className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <Home className="w-4 h-4" />
              Site
            </Link>
            <Link
              to="/blog"
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <Eye className="w-4 h-4" />
              Blog
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-navy border-white bg-white hover:bg-white/90"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Posts</p>
                <p className="text-3xl font-bold text-navy">{stats.totalPosts}</p>
                <p className="text-sm text-gold-light">{stats.publishedPosts} publicados</p>
              </div>
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Categorias</p>
                <p className="text-3xl font-bold text-navy">{stats.totalCategories}</p>
                <p className="text-sm text-gold-light">categorias criadas</p>
              </div>
              <FolderOpen className="w-8 h-8 text-muted-foreground" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rascunhos</p>
                <p className="text-3xl font-bold text-navy">{stats.draftPosts}</p>
                <p className="text-sm text-gold-light">aguardando publicação</p>
              </div>
              <Edit className="w-8 h-8 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "posts" ? "default" : "outline"}
            onClick={() => setActiveTab("posts")}
            className={activeTab === "posts" ? "bg-navy hover:bg-navy-deep" : ""}
          >
            <FileText className="w-4 h-4 mr-2" />
            Posts
          </Button>
          <Button
            variant={activeTab === "categories" ? "default" : "outline"}
            onClick={() => setActiveTab("categories")}
            className={activeTab === "categories" ? "bg-navy hover:bg-navy-deep" : ""}
          >
            <FolderOpen className="w-4 h-4 mr-2" />
            Categorias
          </Button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-navy">
                {activeTab === "posts" ? "Posts do Blog" : "Categorias"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {activeTab === "posts"
                  ? "Gerencie os artigos publicados"
                  : "Gerencie as categorias dos posts"}
              </p>
            </div>
            <Button asChild className="bg-navy hover:bg-navy-deep">
              <Link to={activeTab === "posts" ? "/admin/posts/new" : "/admin/categories/new"}>
                <Plus className="w-4 h-4 mr-2" />
                {activeTab === "posts" ? "Novo Post" : "Nova Categoria"}
              </Link>
            </Button>
          </div>

          {loadingData ? (
            <div className="p-8 text-center text-muted-foreground">Carregando...</div>
          ) : activeTab === "posts" ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Nenhum post encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell>
                        {categories.find((c) => c.id === post.category_id)?.name || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={post.status === "published" ? "default" : "secondary"}
                          className={
                            post.status === "published"
                              ? "bg-navy text-white"
                              : ""
                          }
                        >
                          {post.status === "published" ? "Publicado" : "Rascunho"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(post.created_at).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/blog/${post.id}`}>
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/admin/posts/${post.id}/edit`}>
                              <Edit className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeletePost(post.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground">
                      Nenhuma categoria encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </main>
    </div>
  );
}
